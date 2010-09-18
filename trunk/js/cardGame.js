/* This is the model of a card game. Yay*/

/* Represents the actual game; this is what gets and updates observers! */
function CardGame(options) {
    options = options || {};
    var deck = options.deck || Deck();

    // This is all of the piles on the playing field in this game:
    var piles = [];

    var observers = [];// All observers to be notified of changes.

    /* Returns the deck that this game is using. */
    this.getDeck = function () {
	return deck;
    };

    /* Sets the deck for this game. */
    this.setDeck = function(newDeck) {
	deck = newDeck;
    };

    /* Moves the top card of the specified pile to the top of the second 
     * specified pile.
     */
    this.moveCard = function (pile1, pile2) {
	var card = pile1.pop();

	pile2.addCard(card);

	var move = {
	    source : pile1,
	    destination : pile2,
	    card : card
	};
	var event = new GameChangeEvent(event);

	fire(event);
    };

    /* Adds an observer to the game; the observer will be notified of all 
     * changes on the game.
     */
    this.observe = function (observer) {
	observers.push(observer);
    };

    /* If the given observer is currently observing the game, this removes it. */
    this.removeObserver = function (observer) {
	for (var i = 0; i < observers.length; i++) {
	    if (observer == observers[i]) {
		delete observers[i];
	    }
	}
    };

    /* Fires the given event to all of the observers. */
    function fire(event) {
	for (var i = 0; i < observers.length; i++) {
	    try {
		observers[i](event);
	    } catch (x) {
		delete observers[i];
	    }
	}
    }
}

/* A deck object. The deck has cards but no physical pile. The default 
 * collection of cards is the standard 52 with no jokers.
 */
function Deck(cards) {
    cards = cards || createCards();

    /* Creates the default 52 card deck. */
    function createCards() {
	var newCards = [];
	for (var i = 1; i <= 13; i++) {
	    newCards.push(new Card(i, "s"));
	    newCards.push(new Card(i, "h"));
	    newCards.push(new Card(i, "d"));
	    newCards.push(new Card(i, "c"));
	}

	return newCards;
    }

    /* Shuffles the deck using some shuffling algorithm. */
    cards.shuffle = function () {
	for (var i = 0; i < cards.length; i++) {
	    var card = cards[i];
	    var rnum = Math.floor(Math.random() * (cards.length - i) + i);
	    cards[i] = cards[rnum];
	    cards[rnum] = card;
	}
    };

    /* Returns an array of the string representations of the cards. */
    cards.toStringArray = function () {
	var stringArray = [];

	for (var i = 0; i < cards.length; i++) {
	    stringArray.push(cards[i].toString());
	}
	
	return stringArray;
    };

    return cards;
}

/* A card. This has a rank and a suit unless it is a joker. Jokers will be 
 * implemented at a later date.
 */
function Card(rank, suit) {
    switch (rank) {
	case 1:
	rank = "A";
	break;
	case 11:
	rank = "J";
	break;
	case 12:
	rank = "Q";
	break;
	case 13:
	rank = "K";
	break;
	/* Do nothing by default...*/
    }

    /* Returns the card's suit. This is a single lower-cased letter (s, h, 
     * d, c).
     */
    this.getSuit = function () {
	return suit;
    };
    /* Returns the cards rank which is a number or a letter corresponding to
     * various face cards (ace: A, jack: J, queen: Q and king: K).
     */
    this.getRank = function () {
	return rank;
    };
    
    /* Returns a simple string representation of the card with one to two digits
     * for the rank and a single letter for the suit. Face cards get special
     * letters instead of digits, naturally. This includes aces. Joker support
     * will be added later.
     */
    this.toString = function () {
	return rank + suit;
    };
}

/* Represents a physical pile of cards lying on the table. This doesn't actually
 * have to have any cards in it--it is just a place where cards could be. This
 * takes several options when created: position, relative to another pile or the
 * edge of the field; faceDown: if true, the cards will not be shown (default is 
 * false). A pile can also represent a place for cards to go.
 */
function Pile(options) {
    options = options || {};
    var position = options.position || {topLeft : true};
    var faceDown = faceDown ? true : false;

    // This is where the cards go...
    var cards = [];

    /* Returns the position of the pile relative to other piles or the field. */
    this.getPosition = function () {
	// TODO: rework position properly
	return position;
    };

    /* Returns whether this is a face-down pile or not. Should always return a
     * boolean.
     */
    this.isFaceDown = function () {
	return faceDown;
    };

    /* Returns the number of cards in the pile. */
    this.numberOfCards = function () {
	return cards.length;
    };
    
    /* Adds the given card to the specified position. The card at the very bottom
     * is at index 0; if a negative position is given it will be treated as 0. If
     * a position beyond the top card is given, it will be put on top. If no
     * position is given, the card will also be put on top.
     */
    this.addCard = function (card, position) {
	if (position) {
	    position = position < 0 ? 0 : position;
	    cards.splice(position, 0, card);
	} else {
	    cards.push(card);
	}
    };
    
    /* Gets the card at the specified position. If no position is given, this
     * returns the top card.
     */
    this.getCard = function (position) {
	position = position || cards.length - 1;
	return cards[position];
    };

    /* Returns an array of all of the cards currently in the pile. */
    this.getCards = function () {
	return cards;
    };

    /* Removes the top card and returns it. */
    this.pop = function () {
	return cards.pop();
    };
	
}

/* This is much like a pile except that it has variable width and does not let
 * cards be put there. This should be used to space piles out as necessary. It
 * is exactly one pile high. The given position works the same way as it does for
 * the piles; the given width should be a ratio of the pile where 1.0 is the same
 * as a pile.
 */
function Spacer(width, position) {
    position = position || {right : "left-border"};

    /* Returns the position of this spacer relative to something else...*/
    this.getPosition = function () {
	return position;
    };

    /* Returns the width of this spacer as a ratio of the width of a normal pile
     * where 1.0 is the same as the pile. Having a relative width lets us scale
     * the game easily.
     */
    this.getWidth = function () {
	return width;
    };
}

/* This represents the position of an element on the playing field. It takes an
 * item, which is what the position is based on. If the item is null or the game,
 * then the position is relative to the origin (0, 0) of the playing field. The
 * modification is an object which allows the specification of offsets to the
 * left and right of where this would have been without those offsets. These
 * should be specified as ratios of the width or height of a pile, as 
 * appropriate, so -0.5 would move the given element half of a pile over to the 
 * left if given to the left property.
 */
function Position(item, modification) {
    /* Returns which item this position is relative to. */
    this.getItem = function () {
	return item;
    };

    /* Returns the left offset of the item. This is a ratio of the width of a
     * pile.
     */
    this.getLeftoffset = function () {
	return modification.left || 0;
    };

    /* Returns the top offset of the item. This is a ratio of the height of a
     * pile.
     */
    this.getTopOffset = function () {
	return modification.top || 0;
    };
}

/* An event encapsulating the change in the game state. This should give enough
 * 
 */
function GameChangeEvent(options) {
    options = options || {};

    /* Returns either null or the move of a card. The move will contain the 
     * source (where the card was), the destination (where it is now) and the
     * card itself.
     */
    this.cardMoved = function () {
	return options.move;
    };
}
