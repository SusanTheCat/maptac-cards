function createCard(card) {
    var suit = card.getSuit();
    var rank = card.getRank();
    var div = document.createElement("div");
	div.class = "card";
	div.innerHTML = "<span style='color:#"+(rank=="h"||rank=="d")?"FF0000":"#000000"
		+">"+rank+"</span><br /><img src='img/"+suit+".png' height='15' width='15'>"; /* Ternary operator to determine card color*/
}