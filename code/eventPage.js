//
// BE CAREFUL PUTTING ANYTHING HERE AT THE TOP OF 
// THIS FILE! IT HAS BEEN CAUSING STUFF TO BREAK (ie. THE
// TAB OPENING ONALARM DOESN'T WORK SOMETIMES WHEN THERE'S
// STUFF HERE)
//
// ALSO NOTE THAT CONSOLE.LOG() STATEMENTS DON'T PRINT AT ALL
// IN THIS JS FILE FOR SOME REASON!!! :(
//
// WHEN MAKING CHANGES IN THIS FILE, MAKE SURE TO MANUALLY UPDATE
// THE EXTENSION; SOME CHANGES AREN'T IMMEDIATELY IMPLEMENTED (IDK WHY)
//

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

	var tabs = ["https://www.yahoo.com", "https://www.google.com"];

	// loop through the event's tabs list and open those tabs
	for (var i = 0; i < tabs.length; i++){
		chrome.tabs.create({"url": tabs[i]});
	}
	
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
	var list;
	chrome.storage.local.get({alarms: []}, function(result) {
		list = result.alarms;
	});
	if(!list) {
		list = [];
	} else {
		list = JSON.parse(list);
	}
	return list;
}

/* 
	input: key
	function: remove an alarm with the key from the local storage 
*/
function removeAlarm(text) {
	var list;
	chrome.storage.local.get({alarms: []}, function(result) {
		list = result.alarms;
		for(var key in list) {
			var json = JSON.parse(list[key]);
			if(json.text.localeCompare(text) == 0) {
				list.splice(key, 1);
				break;
			}
		}
		chrome.storage.local.set({"alarms": list}, function() {
			console.log("after deleting: " + list);
		});
	});
}