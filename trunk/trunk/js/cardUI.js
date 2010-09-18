// Config variables
var gameDivId = "game";
//Config end.

function createCard(card) { // Returns a HTML element for placing wherever in the page.
    var suit = card.getSuit();
    var rank = card.getRank();
    var d = document.createElement("div");
	d.setAttribute("class", "card");
	d.innerHTML = "<div style='width:20px;text-align:center;color:#"+((suit=="h"||suit=="d")?"FF":"00")
		+"0000'>"+rank+"</div><img src='img/"+suit+".png' style='height:18;width:18;'>"; // Ternary operator to determine card color. Nothing big.
	switch (rank) { // Ugly hacky switch statement with cascading bits to cut down on code.
		case 3: 
			d.innerHTML += "<div class='b3'><img src='img/"+suit+".png'></div>";
		case 2: 
			d.innerHTML += "<div class='b1'><img src='img/"+suit+".png'></div>"
						+  "<div class='b5'><img src='img/"+suit+".png'></div>";
			break;
		case "A": 
			d.innerHTML += "<div class='a1'><br /><br /><img src='img/"+suit+".png' style='height:70;width:70;'></div>";
			break;
		case 8:
			d.innerHTML += "<div class='b4'><img src='img/"+suit+".png'></div>";
		case 7:
			d.innerHTML += "<div class='b2'><img src='img/"+suit+".png'></div>";
		case 6:
			d.innerHTML += "<div class='a3'><img src='img/"+suit+".png'></div>"
						+  "<div class='c3'><img src='img/"+suit+".png'></div>";
		case 4:
			d.innerHTML += "<div class='a1'><img src='img/"+suit+".png'></div>"
						+  "<div class='a5'><img src='img/"+suit+".png'></div>"
						+  "<div class='c1'><img src='img/"+suit+".png'></div>"
						+  "<div class='c5'><img src='img/"+suit+".png'></div>";
			break;
		case 5:
			d.innerHTML += "<div class='a1'><img src='img/"+suit+".png'></div>"
						+  "<div class='a5'><img src='img/"+suit+".png'></div>"
						+  "<div class='c1'><img src='img/"+suit+".png'></div>"
						+  "<div class='c5'><img src='img/"+suit+".png'></div>"
						+  "<div class='b3'><img src='img/"+suit+".png'></div>";
			break;
		case 9:
			d.innerHTML += "<div class='a1'><img src='img/"+suit+".png'></div>"
						+  "<div class='a2'><img src='img/"+suit+".png'></div>"
						+  "<div class='a4'><img src='img/"+suit+".png'></div>"
						+  "<div class='a5'><img src='img/"+suit+".png'></div>"
						+  "<div class='c1'><img src='img/"+suit+".png'></div>"
						+  "<div class='c2'><img src='img/"+suit+".png'></div>"
						+  "<div class='c4'><img src='img/"+suit+".png'></div>"
						+  "<div class='c5'><img src='img/"+suit+".png'></div>"
						+  "<div class='b3'><img src='img/"+suit+".png'></div>";
			break;
		case 10:
			d.innerHTML += "<div class='a1'><img src='img/"+suit+".png'></div>"
						+  "<div class='a2'><img src='img/"+suit+".png'></div>"
						+  "<div class='a4'><img src='img/"+suit+".png'></div>"
						+  "<div class='a5'><img src='img/"+suit+".png'></div>"
						+  "<div class='c1'><img src='img/"+suit+".png'></div>"
						+  "<div class='c2'><img src='img/"+suit+".png'></div>"
						+  "<div class='c4'><img src='img/"+suit+".png'></div>"
						+  "<div class='c5'><img src='img/"+suit+".png'></div>"
						+  "<div class='b2'><img src='img/"+suit+".png'></div>"
						+  "<div class='b4'><img src='img/"+suit+".png'></div>";
			break;
		case "J":
		case "Q":
		case "K":
			d.innerHTML += "<div class='a1'><img src='img/"+card.toString()+".png' style='height:128;width:78;'></div>";
			// These images are very pixelly and not very nicely done. May change at some point.
	}
	d.getCard = function() {
		return card;
	};
	return d;
}
function indexOf(arr, val) {
	for (var i=0; i<arr.length; i++) {
		if(arr[i]==val) return i;
	}
	return -1;
}
function newGame(game) {
	var gameContainer = document.getElementById(gameDivId);
	var piles = game.getPiles();
	var arr = [];
	var offset_x = 0;
	var pileUI = function (pile) {
		this.ui = pileDiv(pile);
	};
	function eventManager(e) {
		if (e.type=="click") {
			var target = e.target;
			while (target.id=="") {
				target = target.parentElement;
			}
			var index = parseInt(target.id);
			console.log(index+"; "+arr[index]);
			arr[index].act();
		}
	}
	var divArray = [];
	function pileDiv(pile) {
		var d = document.createElement("div");
		var pos;
		if (pile) {
			pos = pile.getPosition();
		} else {
			pos = new Position();
		}
		d.setAttribute("class", "pile");
		var item = divArray[indexOf(arr, pos.getItem())] || document.getElementById(gameDivId);
		console.log(item.id!=gameDivId);
		d.style.left = ((item.style.left=="")?0:parseInt(item.style.left)) + pos.getLeftOffset()*130 - ((item.id!=gameDivId)?0:130);
		d.style.top = ((item.style.left=="")?0:parseInt(item.style.top)) + pos.getTopOffset()*160 - ((item.id!=gameDivId)?160:0);
		var pileCards = pile.getCards();
		var cardDivArray = [];
		for (var i = 0; i<pileCards.length; i++) {
			var card = createCard(pileCards[i]);
			card.style.zIndex = i;
			card.style.left = i/2;
			card.style.top = i/2;
			d.appendChild(card);
			cardDivArray.push(card);
		}
		offset_x += pile.getPosition()*120;
		d.cardDivs = function() {
			return cardDivArray;
		};
		return d;
	}
	
	arr.contains = function (el) {
		for (var i=0; i<arr.length; i++) if (arr[i]==el) return true;
		return false;
	}
	var arrLength = arr.length;
	while(0 < piles.length) {
		for (var i=0; i<piles.length; i++) {
			var item = piles[i].getPosition().getItem();
			if (!item || (!arr.contains(piles[i]) && arr.contains(item))) {
				arr.push(piles[i]);
				piles.splice(i,1);
			}
		}
		if(arr.length != arrLength) arrLength = arr.length;
		else throw("Looks like at least two items are positioned relative to each other. Fix that.");
	}
	for (var i=0; i<arr.length; i++) {
		divArray.push(pileDiv(arr[i]));
		document.getElementById(gameDivId).insertBefore(divArray[divArray.length-1], null);
	}
}