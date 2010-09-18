function createCard(card) {
    var suit = card.getSuit();
    var rank = card.getRank();
    var d = document.createElement("div");
	d.setAttribute("class", "card");
	d.innerHTML = "<div style='width:20px;text-align:center;color:#"+((suit=="h"||suit=="d")?"FF":"00")
		+"0000'>"+rank+"</div><img src='img/"+suit+".png' height='18' width='18'>"; /* Ternary operator to determine card color*/
	document.getElementById("game").insertBefore(d);
}