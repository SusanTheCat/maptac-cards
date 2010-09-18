var gameDivId = "game";
var WIDTH = 130;
var HEIGHT = 160;

function createCard(card) { // Returns a HTML element for placing wherever in the page.
    var suit = card.getSuit();
    var rank = card.getRank();

    var cardElement = new Element("div", {"class" : "card " + suit});
    var text = new Element("div", {"class" : "text"});
    text.innerHTML = rank;
    cardElement.insert(text);

    cardElement.hl = function () {
	this.setStyle({borderColor : "red"});
    };

    cardElement.dhl = function () {
	this.setStyle({borderColor : "#808080"});	
    };
    
    cardElement.insert(new Element("img", {"src" : "img/" + suit + ".png", 
					   "class" : "index"}));

    function suitDiv(cls) {
	var pip = new Element("div", {"class" : cls});
	pip.insert(new Element("img", {"src" : "img/" + suit + ".png"}));
	return pip;
    }

    cardElement.getCard = function () {
	return card;
    };

    switch (rank) {
    case 3: 
	cardElement.insert(suitDiv("b3"));
    case 2: 
	cardElement.insert(suitDiv("b1"));
	cardElement.insert(suitDiv("b5"));
	break;
    case "A": 
	var element = suitDiv("a1");
	element.setAttribute("class", "a1 ace");
	cardElement.insert(element);
	break;
    case 8:
	cardElement.insert(suitDiv("b4"));
    case 7:
	cardElement.insert(suitDiv("b2"));
    case 6:
	cardElement.insert(suitDiv("a3"));
	cardElement.insert(suitDiv("c3"));
    case 4:	
	cardElement.insert(suitDiv("a1"));
	cardElement.insert(suitDiv("a5"));
	cardElement.insert(suitDiv("c1"));
	cardElement.insert(suitDiv("c5"));
	break;
    case 5:
	cardElement.insert(suitDiv("a1"));
	cardElement.insert(suitDiv("a5"));
	cardElement.insert(suitDiv("c1"));
	cardElement.insert(suitDiv("c5"));
	cardElement.insert(suitDiv("b3"));
	break;
    case 9:
	cardElement.insert(suitDiv("a1"));
	cardElement.insert(suitDiv("a2"));
	cardElement.insert(suitDiv("a4"));
	cardElement.insert(suitDiv("a5"));
	cardElement.insert(suitDiv("c1"));
	cardElement.insert(suitDiv("c2"));
	cardElement.insert(suitDiv("c4"));
	cardElement.insert(suitDiv("c5"));
	cardElement.insert(suitDiv("b3"));
	break;
    case 10:
	cardElement.insert(suitDiv("a1"));
	cardElement.insert(suitDiv("a2"));
	cardElement.insert(suitDiv("a4"));
	cardElement.insert(suitDiv("a5"));
	cardElement.insert(suitDiv("c1"));
	cardElement.insert(suitDiv("c2"));
	cardElement.insert(suitDiv("c4"));
	cardElement.insert(suitDiv("c5"));
	cardElement.insert(suitDiv("b2"));
	cardElement.insert(suitDiv("b4"));
	break;
    case "J":
    case "Q":
    case "K":
	var e = new Element("div", {"class" : "a1"});
	var src = "img/" + card.toString() + ".png";
	var img = new Element("img", {"class" : "face", "src" : src});

	e.insert(img);
	cardElement.insert(e);
    }

    return cardElement;
}

function indexOf(arr, val) {
    for (var i=0; i<arr.length; i++) {
	if(arr[i]==val) return i;
    }

    return -1;
}
//----------------------------------------------------------------------------//
function newGame(game) {
    var gameContainer = $(gameDivId);
    var piles = game.getPiles();
    var pilesUI = $A();
    var ces = $A();

    piles.each(function (element) {
		   pilesUI.push(PileUI(element));
	       });

    function hasUIOfPile(pile) {
	var present = false;
	pilesUI.each(function (UI) {
			 if (UI && UI.getPile() == pile) {
			     present = true;
			 }
		     });
    }

    function getUIOf(pile) {
	var retUI = null;
	pilesUI.each(function (UI) {
			 if (UI.getPile() == pile) {
			     retUI = UI;
			 }
		     });
	return retUI;
    }

    function PileUI(pile) {
	var that = new Element("div", {"class" : "pile"});
	var position = pile.getLocation() || new Location();
	var item = position.getItem();
	item = getUIOf(item);

	if (!item) {
	    that.setStyle("left : " + (position.getLeftOffset() - 1)
			  * WIDTH);
	    that.setStyle("top : " + position.getTopOffset() * HEIGHT);
	} else {
	    var left = parseInt(item.getStyle("left"));
	    var top = parseInt(item.getStyle("top"));
	    
	    that.setStyle("left : " + 
			  (left + position.getLeftOffset() * WIDTH) + "px");
	    that.setStyle("top : " + 
			  (top + (position.getTopOffset() - 1) * HEIGHT) + 
			  "px");
	}

	that.getPile = function () {
	    return pile;
	};

	var cardElements = new Array();

	var i = 0;
	pile.getCards().each(function (card) {
				 var cardElement = createCard(card);
				 cardElement.setStyle("z-index : " + i);
				 cardElement.setStyle("left :" + i / 2 );
				 cardElement.setStyle("top :" + i / 2 );
				 i++;

				 that.insert(cardElement);
				 cardElements.push(cardElement);
				 ces.push(cardElement);
			     });

	that.getCardElements = function () {
	    return cardElements;
	};

	that.getCardElement = function (card) {
	    var cardElement = null;
	    cardElements.each(function (element) {
				  if (element.getCard() == card) {
				      cardElement = element;
				  }
			      });

	    return cardElement;
	};

	var obs = function () {
	    this.getPile().act();
	};

	that.observe("click", obs.bind(that));

	return that;
    }

    pilesUI.each(function (element) {
		     gameContainer.insert(element);
		 });

    function getElementOf(card) {
	var element;
	pilesUI.each(function (ui) {
			 if (ui.getCardElement(card)) {
			     element = ui.getCardElement(card);
			 }
		     });
	return element;
    }

    function doMove(move) {
	if (move.source == move.destination) {
	    console.log("NO MOVE!");
	    game.selectCard(null);
	    return;
	}
	var element = getElementOf(move.card);
	var target = getUIOf(move.destination);
	var num = target.getPile().numberOfCards();
	element.setStyle({zIndex : num});
	var dof = move.source.numberOfCards() - num;
	dof /= 2;
	var t = parseInt(element.getStyle("top"));
	var l = parseInt(element.getStyle("left"));
	t -= dof;
	l -= dof;
	element.setStyle({top : t, left : l});

	target.insert(element);
	game.selectCard(null);
    };

    game.observe(function (event) {
		     if (event.getMove()) {
			 doMove(event.getMove());
			 ces.each(function (e) {e.dhl();});
		     }

		     if (event.selectChanged()) {
			 ces.each(function (e) {e.dhl();});
			 var el = getElementOf(event.cardSelected());
			 el.hl();
		     }
		 });
}