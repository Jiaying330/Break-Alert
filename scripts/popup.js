document.addEventListener('DOMContentLoaded', function () {
	var buttonS = document.getElementById("set");
	var buttonC = document.getElementById("clear");
  	buttonS.addEventListener("click", clickS);
  	buttonC.addEventListener("click", clickC); 
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