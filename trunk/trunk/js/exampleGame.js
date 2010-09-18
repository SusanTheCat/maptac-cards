function ExampleGame() {
    var game = new CardGame();
    var pile1 = new Pile(game);
    var pile2Pos = new Position(pile1, {left : 1});
    var pile2 = new Pile(game, {position : pile2Pos});
    var deck = game.getDeck();
	deck.shuffle();
    for (var i = 0; i < deck.length; i++) {
		if (Math.random() < 0.5) {
			pile1.addCard(deck[i]);
		} else {
			pile2.addCard(deck[i]);
		}
    }

    return game;
}