document.addEventListener('DOMContentLoaded', function () {
  	var buttonOL = document.getElementById("openLink");
  	buttonOL.addEventListener("click", clickOL);
});

function clickOL(e) {
	console.log();
    	let links = [];
    
    	for (var i = 0; i <= Number.MAX_VALUE; i++) {
        		if (getElementById("newLink" + i.toString())) {
			links.push(document.getElementById("newLink" + i.toString()).value);
            		} else{
			break;  
		}
    	}

    	for (var j = 0; j < links.length; j++) {
        		if (links[j]) {
			chrome.tabs.create({"url": links[j]});
		}
	}
}