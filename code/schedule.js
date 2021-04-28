var eList = document.getElementById("eventList");
//load stored events from chrome storage
/* Fill out the events on start up */
// const eList = document.getElementById("eventList");
chrome.storage.local.get(["events"], function(result) {
	if(result.events == undefined){
		console.log("here");
		chrome.storage.local.set({"events": []});
	} else {
		var resultList = result.events;
		var copyResultList = [];
		for(var i = 0; i < resultList.length; i++){
			console.log(i);
			var reader = JSON.parse(resultList[i]);
			copyResultList.push(JSON.stringify({
				text: reader.text,
				time: reader.time,
			}));
		}
		
		chrome.storage.local.set({"events": copyResultList}, function() {
			console.log('Value set to ' + copyResultList);
		});

		resultList = copyResultList;
		for(var i = 0; i < resultList.length; i++) {
			eList.appendChild(
				createEvent(
					JSON.parse(resultList[i]).text,
					JSON.parse(resultList[i]).time
				)
			);
		}	
		
	}
});

function createEvent(text, date) {
		var li = document.createElement("li");
		var t = document.createTextNode(text);
		var d = document.createTextNode(date);
		li.appendChild(t);
		li.appendChild(d);
		li.id = text;
		var buttonD = document.createElement("button");
		buttonD.innerHTML = "Delete";
		buttonD.className = "deleteEvent";
		li.appendChild(buttonD);
		// document.getElementById("eventList").appendChild(li);
		buttonD.addEventListener('click', function(){
			removeEvent(text);
			var div = this.parentElement;
			div.style.display = "none";
		});
	return li;
}

document.addEventListener('DOMContentLoaded', function () {
  var buttonAddEvent = document.getElementById("addEvent");
  var buttonEditEvent = document.getElementById("editEvent");
//   var buttonDeleteEvent = document.getElementById("deleteEvent");
  var buttonRepeatEvent = document.getElementById("repeatEvent");
  buttonAddEvent.addEventListener("click", clickAddEvent);
  buttonEditEvent.addEventListener("click", clickEditEvent);
  buttonRepeatEvent.addEventListener("click", clickRepeatEvent);
//   buttonDeleteEvent.addEventListener("click", clickDeleteEvent);
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
		// store new event to storage
		addEvents(text, date);
		
		// display new event
		var li = document.createElement("li");
		var t = document.createTextNode(text);
		var d = document.createTextNode(date);
		li.appendChild(t);
		li.appendChild(d);
		li.id = text;
		var buttonD = document.createElement("button");
		buttonD.innerHTML = "Delete";
		buttonD.className = "deleteEvent";
		li.appendChild(buttonD);
		document.getElementById("eventList").appendChild(li);
		buttonD.addEventListener('click', function(){
			removeEvent(text);
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
		var li = document.getElementById(text);
		li.textContent = text + date;
		var buttonD = document.createElement("button");
		buttonD.innerHTML = "Delete";
		buttonD.className = "deleteEvent";
		li.appendChild(buttonD);
	}
	else {
		alert("invalid input");
		return;
	}
}

function clickRepeatEvent(e) {

}

/* 
	output: returns a list of events stored in local storage
	functon: gets a list of events stored in local storage
*/
function addEvents(text, date, i) {
	chrome.storage.local.get({events: []}, function(result) {
		var list = result.events;
		list.push(JSON.stringify({
			text: text,
			time: date
		}));
		chrome.storage.local.set({"events": list}, function() {
			console.log('value set to ' + list);
		});
	});
}

/* 
	input: text(name) of the event
	function: remove an event with the key from the local storage 
*/
function removeEvent(text) {
	console.log(text);
	var list;
	var i;
	chrome.storage.local.get({events: []}, function(result) {
		list = result.events;
		for(var key in list) {
			console.log(key + ": " + list[key]);
			var n = list[key].search("\"" + text +"\"");
			if(n !== -1) {
				console.log(n);
				list.splice(key, 1);
				break;
			}
		}
		chrome.storage.local.set({"events": list}, function() {
			console.log("after deleting: " + list);
		})
	});
}

/* 
	input: text(name) of the event, time value of the event
	function: edit an event with the name text
*/
function editEvent(text, time) {
	removeEvent(text);
	addEvents(text, time);
}