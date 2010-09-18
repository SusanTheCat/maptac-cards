/* This is a simple game of solitaire with out library! */
function Solitaire() {
    var game = new CardGame();

    var mainPile = new Pile(game, new Position(), 
			    {faceDown : true, action : mainPileAct});

    var discardPile = new Pile(game, new Position(mainPile),
			      {action : discardPileAct});

    var spacer = new Spacer(game, 0.5, new Position(discardPile));

    var suitPiles = [];
    suitPiles.push(new Pile(game, new Position(spacer),
			   {action : suitPileAct}));
    for (var i = 0; i < 3; i++) {
	suitPiles.push(new Pile(game, new Position(suitPiles[i]),
			       {action : suitPileAct}));
    }

    var downPiles = [];

    var downPos = new Position(mainPile, {top : 1, left : 1});
    downPiles.push(new Pile(game, downPos, {action : normalPileAct}));
    game.dealToPile(leftMostPile, 1);

    for (i = 0; i < 6; i++) {
	var downPile = new Pile(game, new Position(downPiles[i]), 
				{faceDown : true});
	game.dealToPile(downPile, i + 1);
	var upPile = new Pile(game, new Position(downPile, {z : 1, left : 0},
						 {action : normalPileAct}));
	game.dealToPile(upPile, 1);
	downPile.setAction(faceDownPileAct(upPile));
	downPiles.push(downPile);
	downPiles.push(upPile);
    }

    function normalPileAct(pile, card) {
	if (card && card.getColor() != pile.getCard().getColor()) {
	    pile.moveCard(card);
	    return true;
	} else if (!card) {
	    pile.selectTopCard();
	    return true;
	}
	return false;
    }

    function faceDownPileAct(upPile) {
	return function (pile, card) {
	    upPile.moveCard(pile.getCard());
	    game.selectCard(null);
	    return !card;
	};
    }

    function suitPileAct(pile, card) {
	if ((pile.isEmpty() && card.getRank() == "A") ||
	    (pile.getCard().getSuit() == card.getSuit() &&
	     nextRank(pile.getCard().getRank()) == card.getRank())) {
	    pile.moveCard(card);
	    return true;
	} else if (!card) {
	    pile.selectTopCard();
	    return true;
	}
	return false;
    }

    function mainPileAct(pile, card) {
	var topCard = pile.getCard();
	discardPile.moveCard(topCard);
	game.selectCard(null);
	return !card;
    }

    function discardPileAct(pile, card) {
	game.selectCard(pile.getCard());
	return !card;
    }
}