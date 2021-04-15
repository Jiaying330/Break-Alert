document.addEventListener('DOMContentLoaded', function () {
	var buttonS = document.getElementById("set");
	var buttonC = document.getElementById("clear");
  	buttonS.addEventListener("click", clickS);
  	buttonC.addEventListener("click", clickC); 

	// implement multi-tab feature
  	var buttonOL = document.getElementById("openLink")
  	buttonOL.addEventListener("click", clickOL);
});

function clickS(e) {
	var minutes = parseInt(document.getElementById("minute").value);
	if(typeof minutes !=="undefined"){
	chrome.alarms.create("breakAlarm",{delayInMinutes : minutes, periodInMinutes : minutes});
	}
	window.close();
}
function clickC(e) {
	chrome.alarms.clear("breakAlarm");
	window.close();
}

// implement multi-tab feature (fixed size inputs)
function clickOL(e) {
	console.log()
    	let links = [];
    	for (var i = 1; i <= 5; i++) {
    		links.push(document.getElementById("in" + i.toString()).value);
    	}

    	for (var i = 0; i < links.length; i++) {
		if (links[i]) {
			chrome.tabs.create({"url": links[i]});
		}
	}
}
