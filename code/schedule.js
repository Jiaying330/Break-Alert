document.addEventListener('DOMContentLoaded', function () {
  var buttonAddEvent = document.getElementById("addEvent");
  var buttonEditEvent = document.getElementById("editEvent");
  var buttonDeleteEvent = document.getElementById("deleteEvent");
  buttonAddEvent.addEventListener("click", clickAddEvent);
  buttonEditEvent.addEventListener("click", clickEditEvent);
  buttonDeleteEvent.addEventListener("click", clickDeleteEvent);
});

/* Fill out the schedule on start up */
var test = [];
chrome.storage.sync.get(["myTabs"], function(result) {
	if(result.myTabs == undefined){
		chrome.storage.sync.set({"myTabs": []});
	} else {
		let resultList = result.myTabs;
		for(var i = 0; i < resultList.length; i++){
			myList.appendChild(
				createTab(
					JSON.parse(resultList[i]).name,
					JSON.parse(resultList[i]).urls
				)
			);
		}
	}
});

/* Show all events */
const eventList = document.getElementById("allEvents");
function createEvent(name, time) {
	var myEvent = document.createElement("div");
	myEvent.innerHTML = name;
	
}
chrome.storage.sync.get(["events"], function(result) {
	if(result.events == undefined) {
		chrome.storage.sync.set({"events": []});
	} else {
		let resultList = result.events;
		for(var i = 0; i < resultList.length; i++) {
			eventList.appendChild(
				createTab(
					JSON.parse(resultList[i]).text,
					JSON.parse(resultList[i]).time
				)
			);
		}
	}
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
		var events = getEvents();
		events.push({'text': text, 'time': date});
		localStorage.setItem('events', JSON.stringify(events));
	}
	else {
		alert("invalid input");
		return;
	}
}

/* 
	input: event
	function: edit an event with specific date/time, and store in local storage
*/
function clickEditEvent(e) {
	var date = document.getElementById("eventDate").value;
	var now = new Date();
	var timeDifference = (new Date(date)).getTime - now.getTime();
	var text = document.getElementById("event").value;
	if(date != "" && text != "") {
		editEvent(text, date);
	}
	else {
		alert("invalid input");
		return;
	}
}

/* 
	input: event
	function: delete an event with specific date/time from local storage
*/
function clickDeleteEvent(e){ 
	var text = document.getElementById("event").value;
	if(text != "") {
		removeEvent(text);
	}
	else {
		alert("invalid input");
		return;
	}
}

/* 
	output: returns a list of events stored in local storage
	functon: gets a list of events stored in local storage
*/
function getEvents() {
	var events = localStorage.getItem('events');
	if(!events) {
		events = [];
	} else {
		events = JSON.parse(events);
	}
	return events;
}

/* 
	input: text(name) of the event
	function: remove an event with the key from the local storage 
*/
function removeEvent(text) {
	var events = getEvents();
	for(var key in events) {
		if(text.localeCompare(events[key].text) == 0) {
			console.log(key);
			console.log(events[key].text);
			events.splice(key, 1);
		}
	}
	localStorage.setItem('events', JSON.stringify(events));
}

/* 
	input: text(name) of the event, time value of the event
	function: edit an event with the name text
*/
function editEvent(text, time) {
	removeEvent(text);
	var events = getEvents();
	events.push({'text': text, 'time': time});
		localStorage.setItem('events', JSON.stringify(events));
}