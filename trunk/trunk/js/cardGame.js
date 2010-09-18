/* This is the model of a card game. Yay*/

/* Represents the actual game; this is what gets and updates observers! */
function CardGame(options) {
    var deck = options.deck || Deck();

    this.getDeck = function () {
	return deck;
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
	for (var i = 0; i < 13; i++) {
	    newCards.push(new Card(i, "s"));
	    newCards.push(new Card(i, "h"));
	    newCards.push(new Card(i, "d"));
	    newCards.push(new Card(i, "c"));
	}

	return newCards;
    }

    return cards;
}

/* A card. This has a rank and a suit unless it is a joker. Jokers will be 
 * implemented at a later date.
 */
function Card(rank, suit) {
    switch (rank) {
	case 1:
	rank = "a";
	case 11:
	rank = "j";
	break;
	case 12:
	rank = "q";
	break;
	case 13:
	rank = "k";
	break;
	/* Do nothing by default...*/
    }

    /* Returns the card's suit. This is a single lower-cased letter (s, h, 
     * d, c).
     */
    this.getSuit = function () {
	return suit;
    }

    /* Returns the cards rank which is a number or a letter corresponding to
     * various face cards (ace: a, jack: j, queen: q and king: k).
     */
    this.getRank = function () {
	return rank;
    }
}
