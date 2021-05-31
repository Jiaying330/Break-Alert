// event object
class eventOb {
	/*
		text: name of the event
		date: date of the event
		repeat: which days do the user want to repeat the event(an array of weekday)
		remind: does the user want to set an alarm(an array of time input)
		tabs: what tabs does the user want to open for the event onAlarm
	*/
	constructor(text, time, repeat, remind, tabs) {
		this.text = text;
		this.time = time;
		this.repeat = repeat;
		this.remind = remind;
    	this.tabs = tabs;
	}
}

/* 
	input: repeat checkbox value
	output: string represented by the value
	function: convert to literal
*/
function getWeekday(num) {
	var result;
	switch(num) {
		case "1":
			result = "Mon";
			break;
		case "2":
			result = "Tue";
			break;
		case "3":
			result = "Wed";
			break;
		case "4":
			result = "Thu";
			break;
		case "5":
			result = "Fri";
			break;
		case "6":
			result = "Sat";
			break;
		case "0":
			result = "Sun";
			break;
		default:
			result = "not detected";
	}
	return result;
}

var eList = document.getElementById("eventList");
// display events
if (eList != null){
	// load stored events from chrome storage
	chrome.storage.local.get(["events"], function(result) {
		if(result.events == undefined){
			chrome.storage.local.set({"events": []});
		} else {
			var resultList = result.events;
			var copyResultList = [];
			for(var i = 0; i < resultList.length; i++){
				var reader = JSON.parse(resultList[i]);
				copyResultList.push(JSON.stringify(reader));
			}
			
			chrome.storage.local.set({"events": copyResultList}, function() {
				console.log('Value initiate to: ' + copyResultList);
			});

			resultList = copyResultList;
			for(var i = 0; i < resultList.length; i++) {
				eList.appendChild(
					createEvent(
						JSON.parse(resultList[i])
					)
				);
			}		
		}
	});
}

/* 
	input: event object
	function: create li element to display event
*/
function createEvent(eventObject) {
	var myEvent = document.createElement("div");
	myEvent.className = "entireEvent";
	var text = eventObject.text;
	myEvent.id = text;
	var li = document.createElement("li");
	li.textContent = text;
	li.id = text;
	li.className = "eventLi";
	var spanDelete = document.createElement("SPAN");
	var txt = document.createTextNode("\u00D7");
	spanDelete.appendChild(txt);
	spanDelete.className = "close";
	spanDelete.id = "deleteEvent";
	li.appendChild(spanDelete);
	spanDelete.addEventListener('click', function(){
		removeEvent(eventObject);
		var div = this.parentElement.parentElement;
		div.style.display = "none";
		removeEListChild(text);
	});
	var dropdown = document.createElement("i");
	dropdown.id = "dropdown";
	dropdown.className = "dropdown glyphicon glyphicon-triangle-bottom";
	dropdown.onclick = function() {
		if(dropdown.className === "dropdown glyphicon glyphicon-triangle-bottom") {
			dropdown.className = "dropdown glyphicon glyphicon-triangle-top";
			var eventTable = document.createElement("table");
			// fill in dropdown
			eventTable.appendChild(dropItem("time", eventObject.time));
			eventTable.appendChild(dropItem("repeat", numToWeekDay(eventObject.repeat)));
			eventTable.appendChild(dropItem("reminder", eventObject.remind));
			eventTable.appendChild(dropItem("tabs", eventObject.tabs));
			myEvent.appendChild(eventTable);
			
		} else {
			dropdown.className = "dropdown glyphicon glyphicon-triangle-bottom";
			while(myEvent.childElementCount != 1) {
				myEvent.removeChild(myEvent.lastChild);
			}
		}
	};
	li.appendChild(dropdown);
	li.addEventListener("click", function(){
		clickEvent(eventObject);
	});
	myEvent.appendChild(li);
	return myEvent;
}

/*
	input: repeat value array
	output: repeat string array
	function: convert numeric values to string to represent weekdays
*/
function numToWeekDay(repeatArray) {
	var result = new Array();
	for (var arrayIndex = 0; arrayIndex < repeatArray.length; arrayIndex++) {
		console.log(repeatArray[arrayIndex] + " : " + getWeekday(repeatArray[arrayIndex]));
		result.push(getWeekday(repeatArray[arrayIndex]));
	}
	return result;
}

/*
	input: event object
	function: fill in the input area with informations stored in the event object
*/
function clickEvent(eventObject) {
	// check if the scheduler window is showing, if not, no need to fill
	var scheduler_show = document.querySelector(".scheduler").classList;
	if (!scheduler_show.contains("show")) {
		return;
	} 
	clickClearInputs();
	var eventName = document.getElementById("event");
	eventName.value = eventObject.text;
	var eventDate = document.getElementById("eventDate");
	eventDate.value = eventObject.time;

	var eventTabs = document.getElementById("tabsToOpen");
	var tabsString = JSON.stringify(eventObject.tabs);
	var splitTabs = tabsString.replaceAll(',', '\n');  // replace all , by newlines
	splitTabs = splitTabs.replaceAll('[', '');  // delete all [] and "" added from stringify
	splitTabs = splitTabs.replaceAll(']', '');
	splitTabs = splitTabs.replaceAll('"', '');
	eventTabs.value = splitTabs;

	var checkBox = document.getElementById("repeat");
	var chks = checkBox.getElementsByTagName("INPUT");

	for (var repeatIndex = 0; repeatIndex < eventObject.repeat.length; repeatIndex++) {
		if (eventObject.repeat[repeatIndex] == 0) {
			chks[6].checked = true;
		}
		else {
			chks[eventObject.repeat[repeatIndex] - 1].checked = true;
		}
	}
	var reminders = document.getElementById("reminder");
	var inputReminders = reminders.getElementsByTagName("INPUT");
	var maxReminders = Math.max(eventObject.remind.length, inputReminders.length);

	// copy over reminders from event to input boxes
	for (var remindIndex = 0; remindIndex < maxReminders; remindIndex++) {
		if (remindIndex < inputReminders.length && remindIndex < eventObject.remind.length) {  // there are enough input boxes to copy event's reminders
			inputReminders[remindIndex].value = eventObject.remind[remindIndex];
		} else if (remindIndex >= inputReminders.length) { // not enough input boxes, so create another and copy over
			var div = document.createElement("div");
			var reminderInput = document.createElement("input");
			reminderInput.setAttribute('type', 'time');
			reminderInput.style = "width:60%";
			reminderInput.value = eventObject.remind[remindIndex];
			div.append(reminderInput);  // append the reminder input to the div

			var deleteReminder = document.createElement("i");
			deleteReminder.className = "glyphicon glyphicon-minus-sign";
			deleteReminder.id = "delReminder";
			deleteReminder.style = "cursor:pointer; font-size:15px;";
			deleteReminder.addEventListener("click", clickDelReminder);
			div.appendChild(deleteReminder);  // append the - button to the div

			reminders.appendChild(div);  // append the div containing the reminder and the - button
		} else if (remindIndex >= eventObject.remind.length){  // more current reminders than the clicked event's reminders, so clear the extras
			inputReminders[remindIndex].value = "";
		}
	}
}

/* 
	input: type of drop item, information to show
	function: create div element to display event informations in dropdown
*/
function dropItem(type, info) {
	var row = document.createElement("tr");
	var tdType = document.createElement("td");
	tdType.appendChild(document.createTextNode(type));
	var tdInfo = document.createElement("td");
	tdInfo.appendChild(document.createTextNode(info));
	row.appendChild(tdType);
	row.appendChild(tdInfo);
	row.id = type;
	return row;
}

document.addEventListener('DOMContentLoaded', function () {
  var buttonAddReminder = document.getElementById("addReminder");
  var buttonAddEvent = document.getElementById("addEvent");
  var buttonEditEvent = document.getElementById("editEvent");
  var buttonDelReminder = document.getElementById("delReminder");
  var buttonClearInputs = document.getElementById("clearInputs");
  if (buttonAddReminder != null){
    buttonAddReminder.addEventListener("click", clickAddReminder);
  }
  if (buttonAddEvent != null){
  	buttonAddEvent.addEventListener("click", clickAddEvent);
  }
  if (buttonEditEvent != null){
	buttonEditEvent.addEventListener("click", clickEditEvent);
  }
  if (buttonDelReminder != null){
    buttonDelReminder.addEventListener("click", clickDelReminder);
  }
  if (buttonClearInputs != null){
    buttonClearInputs.addEventListener("click", clickClearInputs);
  }
});

/*
	function: clear all inputted fields in the events
	(ie. event name, event time, etc.)
*/
function clickClearInputs(){
	var eventName = document.getElementById("event");
	eventName.value = "";
	var eventDate = document.getElementById("eventDate");
	eventDate.value = "";
	var eventTabs = document.getElementById("tabsToOpen");
	eventTabs.value = "";

	// clear all checked boxes for repeating dates
	var checkBox = document.getElementById("repeat");
	var chks = checkBox.getElementsByTagName("INPUT");
	for (var repeatIndex = 0; repeatIndex < 7; repeatIndex++) {
		if (chks[repeatIndex] != null) {
			chks[repeatIndex].checked = false;
		}
	}
	
	// delete all reminders input boxes
	var reminders = document.getElementById("reminder");
	var inputReminders = reminders.getElementsByTagName("INPUT");
	for (var remindIndex = inputReminders.length - 1; remindIndex >= 0 ; remindIndex--) {
		inputReminders[remindIndex].value = "";
		// delete all reminder input fields except the very first one
		if (remindIndex != 0){  
			var element = inputReminders[remindIndex];
			element.parentElement.parentElement.removeChild(element.parentElement);
		}
	}
}

/* 
	input: event 
	function: create new input bar to display on html
*/
function clickAddReminder(e) {
	var div = document.createElement("div");

	var reminderInput = document.createElement("input");
	reminderInput.setAttribute('type', 'time');
	reminderInput.style = "width:60%";
	div.append(reminderInput);

	var deleteReminder = document.createElement("i");
	deleteReminder.className = "glyphicon glyphicon-minus-sign";
	deleteReminder.id = "delReminder";
	deleteReminder.style = "cursor:pointer; font-size:15px;";
	deleteReminder.addEventListener("click", clickDelReminder);

	div.appendChild(deleteReminder);

	document.getElementById("reminder").appendChild(div);
}

/* 
	input: event 
	function: delete input bar for reminder
*/
function clickDelReminder() {
	this.parentElement.parentElement.removeChild(this.parentElement);
}

/* 
	input: event 
	function: set an event with specific date/time, and store in local storage
*/
function clickAddEvent(e) {
	var date = document.getElementById("eventDate").value;
	var text = document.getElementById("event").value;

	// get tabs from the tab textfield and save it into an array to be pushed to storage
	const textarea = document.getElementById("tabsToOpen");
	var tabs = textarea.value.split("\n").map(s => s.trim()).filter(Boolean);

	if(date != "" && text != "") {
		//extract input
		var checkBox = document.getElementById("repeat");
		var chks = checkBox.getElementsByTagName("INPUT");
		var repeat = extractInput(chks);
		var timeInput = document.getElementById("reminder");
		var tmps = timeInput.getElementsByTagName("INPUT");
		var reminders = extractInput(tmps);
		var newEvent = new eventOb(text, date, repeat, reminders, tabs);

		// store new event to storage
		addEvents(newEvent);

		eList.appendChild(createEvent(newEvent));

		// if user set to remind, create alarms
		if(reminders.length > 0) {
			createAlarm(newEvent);
		}
		clickClearInputs();
	}
	else {
		alert("please fill out event name and date");
		return;
	}
}

/* 
	input: input elements
	function: extract user input from the input elements
	output: user input
*/
function extractInput(input) {
	var result = new Array();
	for (var i = 0; i < input.length; i++) {
		if(input[i].checked || (input[i].type == "time" && input[i].value !== "")) {
			console.log("in extractInput, input[i].value = " +input[i].value );
			result.push(input[i].value);
		}
	}
	return result;
}

/* 
	input: event object
	function: create alarms for the event 
*/
function createAlarm(eventObject) {
	var eDate = new Date(eventObject.time);
	console.log("eDate original: " + eDate);
	var now = new Date();
	var eDay = eDate.getDay(); 
	
	// extract reminder times and convert into date format
	var eDates = new Array();
	for(var i = 0; i < eventObject.remind.length; i++) {
		
		var tempDate = new Date(eDate);
		var hours = eventObject.remind[i].split(":");
		tempDate.setHours(hours[0]);
		tempDate.setMinutes(hours[1]);
		eDates.push(tempDate);
		console.log("tempDate = " + tempDate);
	}
	console.log("eDates = " + eDates);
	// create alerts for no repeating event
	if(eventObject.repeat.length < 1) { 
		for(var i = 0; i < eDates.length; i++) {
			console.log("eDates[i] = " + eDates[i]);
			var timeDifference = eDates[i].getTime() - now.getTime();
			console.log("timeDifference = " + timeDifference);
			chrome.alarms.create(eventObject.text + "__" + i, {
				when: Number(now) + timeDifference
			});
			chrome.alarms.get(eventObject.text + "__" + i, function(alarm){
				console.log("when = " + Number(now) + timeDifference);
				console.log("alarm created" + alarm.name);
			})
			
		}
		return;
	}

	// create alerts for repeating event
	for(var i = 0; i < eventObject.repeat.length; i++) {
		for(var j = 0; j < eDates.length; j++) {
			// which weekday to repeat
			var day;
			if (eDay == eventObject.repeat[i]) day = 0;
			else if (eDay > eventObject.repeat[i]) day = 7 - (eDay - eventObject.repeat[i]);
			else day = eventObject.repeat[i] - eDay;
			
			var d = new Date(eDates[j]);
			if(day > 0){
				d.setDate(eDates[j].getDate() + day);
			}
			var timeDifference = (d.getTime() - now.getTime())/1000;
			timeDifference /= 60;
			chrome.alarms.create(eventObject.text + "__" + i + j, {
				delayInMinutes: Math.abs(Math.round(timeDifference)),
				periodInMinutes: 10080 
			});
			chrome.alarms.get(eventObject.text + "__" + i + j, function(alarm) {
				console.log("alarm created: " + alarm.name);
			});
		}	
	}
}

/* 
	input: event object
	function: remove alarms for the event 
*/
function removeAlarms(eventObject) {
	console.log("eventObject.text = " + eventObject.text);
	if(eventObject.repeat.length < 1) {
		for(var i = 0; i < eventObject.remind.length; i++) {
			chrome.alarms.clear(eventObject.text + "__" + i);
			console.log("removed alarm: " + eventObject.text);
		}
		return;
	}
	for(var i = 0; i < eventObject.repeat.length; i++) {
		for(var j = 0; j < eventObject.remind.length; j++) {
			chrome.alarms.clear(eventObject.text + "__" + i + j);
			console.log("removed alarm: " + eventObject.text + "__" + i + j);
		}
	}
}

/* 
	input: event
	function: edit an event and store in local storage
*/
function clickEditEvent(e) {
	var date = document.getElementById("eventDate").value;
	var now = new Date();
	var timeDifference = (new Date(date)).getTime - now.getTime();
	var text = document.getElementById("event").value;
	if(date != "" && text != "") {
		//extract input
		var checkBox = document.getElementById("repeat");
		var chks = checkBox.getElementsByTagName("INPUT");
		var repeat = extractInput(chks);
		var timeInput = document.getElementById("reminder");
		var tmps = timeInput.getElementsByTagName("INPUT");
		var reminders = extractInput(tmps);

		// extract input for tabs to open
		const textarea = document.getElementById("tabsToOpen");
		var tabs = textarea.value.split("\n").map(s => s.trim()).filter(Boolean);

		var newEvent = new eventOb(text, date, repeat, reminders, tabs);
		editEvent(newEvent);

		removeEListChild(text);
		eList.appendChild(createEvent(newEvent));
		clickClearInputs();
	}
	else {
		alert("please fill out event name and date");
		return;
	}
}

/*
	input: name of the event
	function: remove the eList element corresponding to the name of the event
*/
function removeEListChild(text) {
	for(var i = 0; i < eList.childNodes.length; i++) {
		if(eList.childNodes[i].id == text) {
			eList.childNodes[i].style.display = "none";
			eList.removeChild(eList.childNodes[i]);
		}
	}
}

/* 
	input: event object
	function: add the event to the local storage
*/
function addEvents(eventObject) {
	chrome.storage.local.get({events: []}, function(result) {
		var list = result.events;
		list.push(JSON.stringify(eventObject)); 
		chrome.storage.local.set({"events": list}, function() {
			console.log('value set to ' + list);
		});
	});
}

/* 
	input: event object
	function: remove an event with the key from the local storage 
*/
function removeEvent(eventObject) {
	var text = eventObject.text;
	console.log("eventObject.text = " + text);
	var list;
	chrome.storage.local.get({events: []}, function(result) {
		list = result.events;
		for(var key in list) {
			var json = JSON.parse(list[key]);
			console.log(key + ": " + list[key]);
			if(json.text.localeCompare(text) == 0){
				list.splice(key, 1);
				break;
			}
		}
		chrome.storage.local.set({"events": list}, function() {
			console.log("after deleting: " + list);
		})
	});
	if(eventObject.remind) {
		removeAlarms(eventObject);
	}
}

/* 
	input: text(name) of the event, time value of the event
	function: edit an event with the name text
*/
function editEvent(eventObject) {
	var list;
	chrome.storage.local.get({events: []}, function(result) {
		list = result.events;
		var key;
		for(key in list) {
			var event = list[key];
			var json = JSON.parse(list[key]);
			if(json.text.localeCompare(eventObject.text) == 0){
				list.splice(key, 1);
				if(event.remind) {
					removeAlarms(event);
				}
				break;
			}
		}
		list.push(JSON.stringify(eventObject));
		chrome.storage.local.set({"events": list}, function() {
			console.log("after deleting: " + list);
		});
	});
	if (eventObject.remind) {
		createAlarm(eventObject);
	}
}