/* This is the model of a card game. Yay*/

/* Represents the actual game; this is what gets and updates observers! */
function CardGame(options) {
    options = options || {};

    var deck = options.deck || Deck();

    // This is all of the piles on the playing field in this game:
    var piles = [];

    var oldSel = null;
    var selectedCard = null;// This is the selected card, if any.

    var observers = [];// All observers to be notified of changes.

    /* Returns the deck that this game is using. */
    this.getDeck = function () {
	return deck;
    };

    /* Sets the deck for this game. This probably shouldn't be used after the 
     * game starts...
     */
    this.setDeck = function(newDeck) {
	deck = newDeck;
    };

    /* Adds the specified pile to the list of piles. Once again, avoid using this
     * after the game starts properly... This returns the added pile.
     */
    this.addPile = function (pile) {
	piles.push(pile);
	return pile;
    };

    /* Removes the specified pile from the list of piles. If the given pile is 
     * not in the list, nothing happens. Ditto for not using during a game.
     */
    this.removePile = function (pile) {
	for (var i = 0; i < piles.length; i++) {
	    if (pile == piles[i]) {
		piles.splice(i);
	    }
	}
    };

    /* Deals the given number of cards to the specified pile, firing an event 
     * that contains information about all of the cards dealt to that pile.
     */
    this.dealToPile = function (pile, number) {
	var cardsMoved = [];
	for (var i = 0; i < number; i++) {
	    var card = deck.pop();
	    cardsMoved.push(card);
	    pile.addCard(card);
	}

	var event = new GameChangeEvent({cardsMoved : cardsMoved});
	fire(event);
    };

    /* Deals all of the remaining cards in the deck to the given pile, firing
     * the appropriate event as it does. This is bascially a convenience
     * method that uses "dealToPile".
     */
    this.dealRemainderToPile = function (pile) {
	this.dealToPile(pile, cards.length);
    };

    /* Selects the specified card, firing the appropriate event. */
    this.selectCard = function (card) {
	oldSel = selectedCard || oldSel;
	selectedCard = card;
	fire(new GameChangeEvent({selected : card, cardMoved : false}));
    };

    /* Selects the top card of the specified pile. */
    this.selectCardOnPile = function (pile) {
	oldSel = selectedCard || oldSel;
	selectedCard = pile.getCard();
	fire(new GameChangeEvent({selected : card, cardMoved : false}));
    };
   
    /* Returns the card that is selected. */
    this.getSelectedCard = function () {
	return selectedCard;
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

	var event = new GameChangeEvent({move : move});
	fire(event);
    };

    /* Moves the specified card to the specified pile, removing it from its
     * current pile if necessary and firing the appropriate event.
     */
    this.moveCardToPile = function (card, pile) {
	var oldPile = card.getPile();

	if (oldPile) {
	    oldPile.removeCard(card);
	}

	pile.addCard(card);

	var move = {
	    source : oldPile,
	    destination : pile,
	    card : card
	};

	var event = GameChangeEvent({move : move});

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
		observers.splice(i, 1);
	    }
	}
    };

    /* Returns all of the piles currently in the game. */
    this.getPiles = function () {
	return piles;
    };

    /* Fires the given event to all of the observers. */
    function fire(event) {
	for (var i = 0; i < observers.length; i++) {
	    try {
		observers[i](event);
	    } catch (x) {
		observers.splice(i, 1);
	    }
	}
    }

    /* An event encapsulating the change in the game state. This should give
     * enough information to keep the game completely up to date.
     */
    function GameChangeEvent(options) {
	options = options || {};

	var selectChange = options.selected ? true : false;
	options.selected = options.selected || selectedCard;

	var move = options.move;

	/* Returns whether a card was moved as part of this event. */
	this.cardMoved = function () {
	    if (move) {
		return move.source != move.destination;
	    } else {
		return false;
	    }
	};

	this.getOldSel = function () {
	    console.log(oldSel);
	    return oldSel;
	};

	/* Returns the move this event represents or null if there was no 
	 * move. 
	 */
	this.getMove = function () {
	    return move;
	};

	/* Returns the card that is selected after this event. */
	this.cardSelected = function () {
	    return options.selected;
	};

	/* Returns whether the selected card changed causing this event. */
	this.selectChanged = function () {
	    return selectChange;
	};

	/* Returns all of the affected cards in an array. */
	this.cardsMoved = function () {
	    if (options.cardsMoved) {
		return cardsMoved;
	    } else if (move && (move.source != move.destination)) {
		return [move.card];
	    } else {
		return null;
	    }
	};
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
    var pile = null;// No pile by default.

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

    /* Sets the pile that contains this card. This does not actually move the
     * card at the moment.
     */
    this.setPile = function (newPile) {
	pile = newPile;
    };

    /* Returns the card's current pile or null if there is not pile. */
    this.getPile = function () {
	return pile;
    };

    /* Returns the card's color which is either red or black. */
    this.getColor = function () {
	if (this.getSuit() == "h" || this.getSuit == "d") {
	    return "red";
	} 
	
	return "black";
    };
}

/* Represents a physical pile of cards lying on the table. This doesn't actually
 * have to have any cards in it--it is just a place where cards could be. This
 * takes several options when created: position, relative to another pile or the
 * edge of the field; faceDown: if true, the cards will not be shown (default is 
 * false). A pile can also represent a place for cards to go. 
 * 
 * A pile has an "action" which is a function that will be called when the pile 
 * is in some way activated (e.g. it is clicked or a card is dragged there). The 
 * pile will then respond to the action as it should. The action gets two 
 * arguments: first the pile and then the card that may or may not have been 
 * passed to the pile. The default action is to select the top card if it is not
 * selected and to move the given card to the pile if there is one.
 */
function Pile(parent, position, options) {
    options = options || {};
    position = position || new Location();
    var faceDown = faceDown ? true : false;
    var numCards = options.cards || 0;

    // This is where the cards go...
    var cards = [];

    // This is the action that is called when the pile gets a card or click.
    var action = options.action || function (pile, card) {
	if (card) {
	    parent.moveCard(card.getPile(), pile);
	} else {
	    pile.selectTopCard();
	}
    };

    /* Sets the top card of the pile as selected. */
    this.selectTopCard = function () {
	parent.selectCard(this.getCard());
    };

    /* Moves the specified card from wherever it is to this pile. */
    this.moveCard = function (card) {
	parent.moveCardToPile(card, this);
    };

    if (numCards) {
	parent.dealToPile(this, numCards);
    }

    /* Sets the action that will be performed when the pile either gets a card or
     * gets clicked on. Usually this will either put the given card on the pile
     * or select the top card of the pile. The first argument the action gets is
     * the pile that called it.
     */
    this.setAction = function (newAction) {
	action = newAction;
    };

    /* Returns the position of the pile relative to other piles or the field. */
    this.getLocation = function () {
	return position;
    };

    /* This should be fired if the pile is given a card or clicked. If it is 
     * given a card, that card should be passed here; otherwise some falsey value
     * (undefined is good here) should be given.
     */
    this.act = function (card) {
	if (parent.getSelectedCard()) {
	    card = parent.getSelectedCard();
	}
	action(this, card);
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

	card.setPile(this);
    };
    
    /* Gets the card at the specified position. If no position is given, this
     * returns the top card.
     */
    this.getCard = function (position) {
	position = position || cards.length - 1;
	return cards[position];
    };

    /* Removes the specified card from the pile. If the card is not in the pile,
     * nothing happens.
     */
    this.removeCard = function (card) {
	for (var i = 0; i < cards.length; i++) {
	    if (card == cards[i]) {
		card.setPile(null);
		cards.splice(i, 1);
	    }
	}
    };

    /* Removes the card at the given position and returns it. If the position is
     * out of bounds, returns null.
     */
    this.removeCardAt = function (position) {
	if (position < 0 || position >= cards.length) {
	    return null;
	}
	
	var card = cards[i];
	cards.splice(i, 1);
	return card;
    };

    /* Returns an array of all of the cards currently in the pile. */
    this.getCards = function () {
	return cards;
    };

    /* Removes the top card and returns it. */
    this.pop = function () {
	return cards.pop();
    };

    /* Returns whether the pile is empty (e.g. it has no cards in it) or not. */
    this.isEmpty = function () {
	return cards.length == 0;
    };

    if (parent) {
	parent.addPile(this);
    }	
}

/* This is much like a pile except that it has variable width and does not let
 * cards be put there. This should be used to space piles out as necessary. It
 * is exactly one pile high. The given position works the same way as it does for
 * the piles; the given width should be a ratio of the pile where 1.0 is the same
 * as a pile.
 */
function Spacer(parent, width, position) {
    position = position || newosition();

    /* Returns the position of this spacer relative to something else...*/
    this.getLocation = function () {
	return position;
    };

    /* Returns the width of this spacer as a ratio of the width of a normal pile
     * where 1.0 is the same as the pile. Having a relative width lets us scale
     * the game easily.
     */
    this.getWidth = function () {
	return width;
    };

    if (parent) {
	parent.addPile(this);
    }
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
function Location(item, modification) {
    modification = modification || {};

    /* Returns which item this position is relative to. */
    this.getItem = function () {
	return item;
    };

    /* Returns the left offset of the item. This is a ratio of the width of a
     * pile. The default left offset is 1!
     */
    this.getLeftOffset = function () {
	return modification.left || 1;
    };

    /* Returns the top offset of the item. This is a ratio of the height of a
     * pile.
     */
    this.getTopOffset = function () {
	return modification.top || 0;
    };

    /* Returns the z-offset of the element relative to the other element. */
    this.getZOffset = function () {
	return modification.z || 0;
    };
}

/* Gets the next rank in order from ace to king. If king is given, this returns 
 * null instead of wrapping over.
 */
function nextRank(rank) {
    switch (rank) {
    case "a":
	return 2;
    case 10:
	return "j";
    case "j":
	return "q";
    case "q":
	return "k";
    case "k":
	return null;
    default:
	return rank++;
    }
}