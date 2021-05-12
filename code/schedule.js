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
		// this.subEvents = subEvents;
	}
}

var eList = document.getElementById("eventList");
if (eList != null){
	//load stored events from chrome storage
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


		resultList = copyResultList;
		for(var i = 0; i < resultList.length; i++) {
			eList.appendChild(createEvent(JSON.parse(resultList[i])));
		}		
	}
});

/* 
	input: event object
	function: create li element to display event
*/
function createEvent(eventO) {
	var myEvent = document.createElement("div");
	myEvent.className = "entireEvent";
	var text = eventO.text;
	myEvent.id = text;
	var date = eventO.time;
	var li = document.createElement("li");
	li.textContent = text;
	li.id = text;
	li.className = "eventLi";
	var buttonD = document.createElement("button");
	buttonD.innerHTML = "Delete";
	buttonD.className = "deleteEvent";
	li.appendChild(buttonD);
	buttonD.addEventListener('click', function(){
		removeEvent(eventO);
		var div = this.parentElement;
		div.style.display = "none";
	});
	
	var dropdown = document.createElement("i");
	dropdown.className = "dropdown glyphicon glyphicon-triangle-bottom";
	dropdown.onclick = function() {
		if(dropdown.className === "dropdown glyphicon glyphicon-triangle-bottom") {
			var subEventList = eventO.subEvents;
			dropdown.className = "dropdown glyphicon glyphicon-triangle-top";
			myEvent.appendChild(dropItem("time", eventO.time));
			myEvent.appendChild(dropItem("repeat", eventO.repeat));
			myEvent.appendChild(dropItem("reminder", eventO.remind));

			// for(var i = 0; i < subEventList.length; i++) {
			// 	myEvent.appendChild(subEventListItem(subEventList[i]));
			// }
		} else {
			dropdown.className = "dropdown glyphicon glyphicon-triangle-bottom";
			while(myEvent.childElementCount != 1) {
				myEvent.removeChild(myEvent.lastChild);
			}
		}
	};
	li.appendChild(dropdown);
	myEvent.appendChild(li);
	return myEvent;
}

function dropItem(type, info) {
	var listItem = document.createElement("div");
	listItem.style = "display:block;";
	listItem.className = "listItemClass"
	var listItemInner = document.createElement("div");
	listItemInner.style = "text-align:left; background-color:#f0f5f5;";
	listItemInner.innerHTML = type + ": " + info;
	listItem.appendChild(listItemInner);
	return listItem;
}

document.addEventListener('DOMContentLoaded', function () {
  var buttonAddReminder = document.getElementById("addReminder");
  var buttonAddEvent = document.getElementById("addEvent");
  var buttonEditEvent = document.getElementById("editEvent");
  if (buttonAddReminder != null){
    buttonAddReminder.addEventListener("click", clickAddReminder);
  }
	if (buttonAddEvent != null){
  	buttonAddEvent.addEventListener("click", clickAddEvent);
	}
  if (buttonEditEvent != null){
		buttonEditEvent.addEventListener("click", clickEditEvent);
	}
});

/* 
	input: event 
	function: create new input bar to display on html
*/
function clickAddReminder(e) {
	var reminderInput = document.createElement("input");
	reminderInput.setAttribute('type', 'time');
	reminderInput.style = "width:60%";
	document.getElementById("reminder").appendChild(reminderInput);
}
/* 
	input: event 
	function: set an event with specific date/time, and store in local storage
*/
function clickAddEvent(e) {
	var date = document.getElementById("eventDate").value;
	var now = new Date();
	var text = document.getElementById("event").value;

	// get tabs from the tab textfield and save it into an array to be pushed to storage
	const textarea = document.getElementById("tabsToOpen");
	var tabs = textarea.value.split("\n").map(s => s.trim()).filter(Boolean);
	console.log("tabs for event are " + tabs);


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
	}
	else {
		alert("invalid input");
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
			chrome.alarms.create(eventObject.text + i, {
				when: Number(now) + timeDifference
			});
			console.log("when = " + Number(now) + timeDifference);
			console.log("alarm created" + eventObject.text + i);
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
			chrome.alarms.create(eventObject.text + i + j, {
				delayInMinutes: Math.abs(Math.round(timeDifference)),
				periodInMinutes: 10080 
			});
			chrome.alarms.get(eventObject.text + i + j, function(alarm) {
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
			chrome.alarms.clear(eventObject.text + i);
			console.log("removed alarm: " + eventObject.text);
		}
		return;
	}
	for(var i = 0; i < eventObject.repeat.length; i++) {
		for(var j = 0; j < eventObject.remind.length; j++) {
			chrome.alarms.clear(eventObject.text + i + j);
			console.log("removed alarm: " + eventObject.text + i + j);
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
		var newEvent = new eventOb(text, date, repeat, reminders);
		editEvent(newEvent);

		for(var i = 0; i < eList.childNodes.length; i++) {
			if(eList.childNodes[i].id == text) {
				eList.childNodes[i].style.display = "none";
				eList.removeChild(eList.childNodes[i]);
			}
		}
		eList.appendChild(createEvent(newEvent));
		
	}
	else {
		alert("invalid input");
		return;
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
	// var key = findEventKey(eventObject);
	// if(key !== -1) {

	// 	chrome.storage.local.get({events: []}, function(result) {
	// 		list = result.events;
	// 		list.splice(key, 1);
	// 	});
	// 	chrome.storage.local.set({"events": list}, function() {
	// 		console.log("after deleting: " + list);
	// 	});
	// 	if(eventObject.remind.length > 0) {
	// 		removeAlarms(eventObject);
	// 	}
	// }
}

/* 
	input: text(name) of the event, time value of the event
	function: edit an event with the name text
*/
function editEvent(eventObject) {
	var list;
	chrome.storage.local.get({events: []}, function(result) {
		list = result.events;
		for(var key in list) {
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
	// var kexy = findEventKey(eventObject);
	// if(key !== -1) {
	// 	chrome.storage.local.get({events: []}, function(result) {
	// 		list = result.events;
	// 		if(list[key].remind.length > 0) {
	// 			removeAlarms(list[key]);
	// 		}
	// 		list.splice(key, 1);
	// 	});		
	// 	list.push(JSON.stringify(eventObject)); 
	// 	chrome.storage.local.set({"events": list}, function() {
	// 		console.log("after deleting: " + list);
	// 	});
	// 	if (eventObject.remind !== "") {
	// 		createAlarm(eventObject);
	// 	}
	// }
}

/*
	input: event object
	function: find the key for the event from local storage
	output: key
*/
function findEventKey(eventObject) {
	var list;
	chrome.storage.local.get({events: []}, function(result) {
		list = result.events;
		for(var key in list) {
			var json = JSON.parse(list[key]);
			if(json.text.localeCompare(eventObject.text) === 0){
				return key;
			}
		}
	});
	return -1;
}