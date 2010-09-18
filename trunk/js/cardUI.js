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
	return d;
}