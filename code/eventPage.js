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
	var content;
	// alarms are named differently from events, so we need to extract the first part of the alarm
	// name in order to get the corresponding event name
	var splitAlarmName = (alarm.name).split("__");
	var name = splitAlarmName[0];
	content = name;
	chrome.storage.local.get({alarms: []}, function(result) {
		var alarmList = result.alarms;
		var alarmIndex;
		for (alarmIndex = 0; (alarmIndex < alarmList.length && (JSON.parse(alarmList[alarmIndex]).text != name)); alarmIndex++){}
		if(alarmIndex < alarmList.length) {
			if(typeof alarm.when != "undefined") {
				alarmList.splice(alarmIndex, 1);
				chrome.storage.local.set({"alarms": alarmList}, function() {
				})
			}
		}
		
	});

	// get events array from Chrome Storage and extract the tabs from event
	chrome.storage.local.get({events: []}, function(result) {
		var eventsList = result.events;
		var alarmIndex = 0;  // var to get index of the event in eventsList
		// loop through eventsList to find the corresponding index for the alarm
		for (; (alarmIndex < eventsList.length) && (JSON.parse(eventsList[alarmIndex]).text != name); alarmIndex++);

		// parse through the corresponding event in eventsList and extract its tabs array
		var tabs = JSON.parse(eventsList[alarmIndex]).tabs;

		// loop through the event's tabs list and open those tabs
		if (tabs != null){
			for (var i = 0; i < tabs.length; i++){
				chrome.tabs.create({"url": tabs[i]});
			}
		}
	});
	alert(content);
});