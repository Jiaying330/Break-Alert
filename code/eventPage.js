chrome.alarms.onAlarm.addListener(function(alarm){
// <<<<<<< HEAD
	var alarms = getAlarms();
	var content;
	for(var key in alarms) {
		if(alarm.name.localeCompare(alarms[key].text) == 0) {
			content = alarms[key].text;

			//if not a loop alarm, delete right away from the local storage
			if(typeof alarm.when != "undefined"){ 
				removeAlarm(key);
			}
		}
	}
	alert(content);
	
// =======
// 	if(alarm.name === 'breakAlarm') {
// 		alert("Time to take a break!");
// 	}
// 	else {
// 		var alarms = getAlarms();
// 		var content;
// 		for(var key in alarms) {
// 			var date = new Date(alarms[key].time);
// 			if(alarm.name === alarms[key].text) {
// 				content = alarms[key].text;
// 				removeAlarm(key);
// 			}
// 		}
// 		alert(content);
// 	}
// >>>>>>> eric2
});

/* 
	output: returns a list of alarms stored in local storage
	functon: gets a list of alarms stored in local storage
*/
function getAlarms() {
	var alarms = localStorage.getItem('alarms');
	if(!alarms) {
		alarms = [];
	} else {
		alarms = JSON.parse(alarms);
	}
	return alarms;
}

/* 
	input: key
	function: remove an alarm with the key from the local storage 
*/
function removeAlarm(key) {
	var alarms = getAlarms();
	alarms.splice(key, 1);
	localStorage.setItem('alarms', JSON.stringify(alarms));
}