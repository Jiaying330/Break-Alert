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
	var tabs = [];  // array to store tasks from event into
	chrome.storage.local.get({events: []}, function(result) {
		var eventsList = result.events;
		var alarmIndex = 0;  // var to get index of the event in eventsList
		// loop through eventsList to find the corresponding index for the alarm
		for (; (alarmIndex < eventsList.length) && (JSON.parse(eventsList[alarmIndex]).text != name); alarmIndex++);

		// parse through the corresponding event in eventsList and extract its tabs array
		tabs = JSON.parse(eventsList[alarmIndex]).tabs;
	});

	chrome.storage.sync.get(["myTabs"], function(result) {
		var tabList = result.myTabs;

		// loop through the event's tabs list and open those tabs
		if (tabs != null){
			for (var index = 0; index < tabs.length; index++){
				// if saved tab is a direct website, open it
				if (tabs[index].startsWith("http")){
					chrome.tabs.create({"url": tabs[index]});
				}

				// otherwise, check if it's the name of a user-defined multi-tab and open it
				else {
					var multiTabName = tabs[index]; // the name of the tab that the user inputted for the event
					var length = tabList.length;  // length is the total # of defined multitabs to search through
					var parsedMultiTab;  // var to hold the parsed user defined multitab

					var pos;  // get the position of the tab name in the multitabs list, or return pos = length if it doesn't exist
					for (pos = 0; pos < length; pos++){
						parsedMultiTab = JSON.parse(tabList[pos]);
						// check if we found a matching multitab name
						if (parsedMultiTab.name === multiTabName)
							break;
					}
					
					// if pos < length, we found a defined tab so open up all the corresponding urls
					if (pos < length){
						var urlList = parsedMultiTab.urls;

						// open the tabs in the tab list
						for(var j = 0; j < urlList.length; j++){
							chrome.tabs.create({"url": urlList[j]});
						}
					}  // end if
				}  // end else
			}  // end for
		}
	}); // end get


	alert(content);
});