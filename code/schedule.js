// event object
class eventOb {
	/*
		text: name of the event
		date: date of the event
		repeat: which days do the user want to repeat the event
		alarm: does the user want to set an alarm
	*/
	constructor(text, time, repeat, alarm) {
		this.text = text;
		this.time = time;
		this.repeat = repeat;
		this.alarm = alarm;
	}
}

var eList = document.getElementById("eventList");

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

/* 
	input: event object
	function: create li element to display event
*/
function createEvent(eventO) {
		var text = eventO.text;
		var date = eventO.time;
		var li = document.createElement("li");
		li.textContent = text + ": " + date;
		li.id = text;
		var buttonD = document.createElement("button");
		buttonD.innerHTML = "Delete";
		buttonD.className = "deleteEvent";
		li.appendChild(buttonD);
		buttonD.addEventListener('click', function(){
			removeEvent(eventO);
			var div = this.parentElement;
			div.style.display = "none";
		});
	return li;
}

document.addEventListener('DOMContentLoaded', function () {
  var buttonAddEvent = document.getElementById("addEvent");
  var buttonEditEvent = document.getElementById("editEvent");
  buttonAddEvent.addEventListener("click", clickAddEvent);
  buttonEditEvent.addEventListener("click", clickEditEvent);
});


/* 
	input: event 
	function: set an event with specific date/time, and store in local storage
*/
function clickAddEvent(e) {
	var date = document.getElementById("eventDate").value;
	var now = new Date();
	var timeDifference = (new Date(date)).getTime - now.getTime();
	var text = document.getElementById("event").value;
	if(date != "" && text != "") {
		//extract input
		var checkBox = document.getElementById("repeat");
		var chks = checkBox.getElementsByTagName("INPUT");
		var repeat = new Array();
		for (var i = 0; i < chks.length; i++) {
			if(chks[i].checked) {
				repeat.push(chks[i].value);
			}
		}
		var remind = document.getElementById("remindTime").value;
		var newEvent = new eventOb(text, date, repeat, remind);

		// store new event to storage
		addEvents(newEvent);

		eList.appendChild(createEvent(newEvent));

		// if user set to remind, create alarms
		if(remind != "") {
			createAlarm(newEvent);
		}
	}
	else {
		alert("invalid input");
		return;
	}
}

/* 
	input: event object
	function: create alarms for the event 
*/
function createAlarm(newEvent) {
	var eDate = new Date(newEvent.time);
	console.log("eDate original: " + eDate);
	var now = new Date();
	var eDay = eDate.getDay();
	var hours = newEvent.alarm.split(":");
	eDate.setHours(hours[0]);
	eDate.setMinutes(hours[1]);
	console.log("eDate after: " + eDate);

	if(newEvent.repeat.length < 1) { // no repeating
		var timeDifference = (eDate).getTime() - now.getTime()
		chrome.alarms.create(newEvent.text, {
			when: Number(now) + timeDifference
		});
		console.log("alarm created" + newEvent.text);
		return;
	}

	for(var i = 0; i < newEvent.repeat.length; i++) {
		var day;
		if (eDay == newEvent.repeat[i]) day = 0;
		else if (eDay > newEvent.repeat[i]) day = 7 - (eDay - newEvent.repeat[i]);
		else day = newEvent.repeat[i] - eDay;
		console.log("day = " + day);
		var d = new Date(eDate);
		if(day > 0){
			d.setDate(eDate.getDate() + day);
		}
		console.log("d = " + d);
		var timeDifference = (d.getTime() - now.getTime())/1000;
		timeDifference /= 60;
		console.log("timeDifference = " + timeDifference);
		chrome.alarms.create(newEvent.text + i, {
			delayInMinutes: Math.abs(Math.round(timeDifference)),
			periodInMinutes: 10080
		});
		chrome.alarms.get(newEvent.text + i, function(alarm) {
			console.log("alarm created: " + alarm.name);
		})
		
	}
}

/* 
	input: event object
	function: remove alarms for the event 
*/
function removeAlarm(eventO) {
	console.log("eventO.text = " + eventO.text);
	if(eventO.repeat.length < 1) {
		chrome.alarms.clear(eventO.text);
		console.log("removed alarm: " + eventO.text);
		return;
	}
	for(var i = 0; i < eventO.repeat.length; i++) {
		chrome.alarms.clear(eventO.text + i);
		console.log("removed alarm: " + eventO.text + i);
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

		var checkBox = document.getElementById("repeat");
		var chks = checkBox.getElementsByTagName("INPUT");
		var repeat = new Array();
		for (var i = 0; i < chks.length; i++) {
			if(chks[i].checked) {
				repeat.push(chks[i].value);
			}
		}
		var remind = document.getElementById("remindTime").value;
		var newEvent = new eventOb(text, date, repeat, remind);
		editEvent(newEvent);
		
		var li = document.getElementById(text);
		li.textContent = text + ": " + date;
		var buttonD = document.createElement("button");
		buttonD.innerHTML = "Delete";
		buttonD.className = "deleteEvent";
		li.appendChild(buttonD);
		buttonD.addEventListener('click', function(){
			removeEvent(newEvent);
			var div = this.parentElement;
			div.style.display = "none";
		});
		
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
function addEvents(newEvent) {
	chrome.storage.local.get({events: []}, function(result) {
		var list = result.events;
		list.push(JSON.stringify(newEvent)); 
		chrome.storage.local.set({"events": list}, function() {
			console.log('value set to ' + list);
		});
	});
}

/* 
	input: event object
	function: remove an event with the key from the local storage 
*/
function removeEvent(eventO) {
	var text = eventO.text;
	console.log("eventO.text = " + text);
	var list;
	var i;
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
	removeAlarm(eventO);
}

/* 
	input: text(name) of the event, time value of the event
	function: edit an event with the name text
*/
function editEvent(eEvent) {
	var list;
	var i;
	var arr;
	chrome.storage.local.get({events: []}, function(result) {
		list = result.events;
		for(var key in list) {
			var json = JSON.parse(list[key]);
			if(json.text.localeCompare(eEvent.text) == 0){
				list.splice(key, 1);
				removeAlarm(eEvent);
				break;
			}
		}
		list.push(JSON.stringify(eEvent)); 
		chrome.storage.local.set({"events": list}, function() {
			console.log("after deleting: " + list);
		});
	});
	if (eEvent.remind !== "") {
		createAlarm(eEvent);
	}
}