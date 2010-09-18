/* This is a simple game of solitaire with out library! */

function Solitaire() {
    var game = new CardGame();

    var mainPile = new Pile(game, new Position(), {faceDown : true});

    var discardPile = new Pile(game, new Position(mainPile));

    var spacer = new Spacer(game, 0.5, new Position(discardPile));

    var suitPiles = [];
    suitPiles.push(new Pile(game, new Position(spacer)));
    for (var i = 0; i < 3; i++) {
	suitPiles.push(new Pile(game, new Position(suitPiles[i])));
    }

    var downPiles = [];

    var downPos = new Position(mainPile, {top : 1, left : 1});
    downPiles.push(new Pile(game, downPos));
    game.dealToPile(leftMostPile, 1);

    for (var i = 0; i < 6; i++) {
	var downPile = new Pile(game, new Position(downPiles[i]), 
				{faceDown : true});
	game.dealToPile(downPile, i + 1);
	var upPile = new Pile(game, new Position(downPile, 
						 {z : 1, left : 0}));
	game.dealToPile(upPile, 1);
	downPiles.push(downPile);
	downPiles.push(upPile);
    }
}

function normalPile(pile, card) {
    if (card && card.getColor() != pile.getCard().getColor()) {
	pile.moveCard(card);
    } else if (!card) {
	pile.selectTopCard();
    }
}