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
	setText(newText) {
		this.text = newText;
	}
	setDate(newTime) {
		this.time = newTime;
	}
	setRepeat(newRepeat) {
		this.repeat = newRepeat;
	}
	setAlarm(newAlarm) {
		this.alarm = newAlarm;
	}
}

var eList = document.getElementById("eventList");
//load stored events from chrome storage
chrome.storage.local.get(["events"], function(result) {
	if(result.events == undefined){
		chrome.storage.local.set({"events": []});
	} else {
		// var resultList = result.events;
		// var copyResultList = [];
		// for(var i = 0; i < resultList.length; i++){
		// 	var reader = JSON.parse(resultList[i]);
		// 	copyResultList.push(JSON.stringify({
		// 		text: reader.text,
		// 		time: reader.time,
		// 	}));
		var resultList = result.events;
		var copyResultList = [];
		for(var i = 0; i < resultList.length; i++){
			var reader = JSON.parse(resultList[i]);
			copyResultList.push(JSON.stringify(reader));
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
		li.textContent = text + " - " + date;
		// var t = document.createTextNode(text);
		// var d = document.createTextNode(date);
		// li.appendChild(t);
		// li.appendChild(d);
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
		eList.appendChild(createEvent(text, date));
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
		li.textContent = text + " - " + date;
		var buttonD = document.createElement("button");
		buttonD.innerHTML = "Delete";
		buttonD.className = "deleteEvent";
		li.appendChild(buttonD);
		buttonD.addEventListener('click', function(){
			removeEvent(text);
			var div = this.parentElement;
			div.style.display = "none";
		});
		// eList.appendChild(createEvent(text, date));
	}
	else {
		alert("invalid input");
		return;
	}
}

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
}

/* 
	input: text(name) of the event, time value of the event
	function: edit an event with the name text
*/
function editEvent(eEvent) {
	var list;
	var i;
	chrome.storage.local.get({events: []}, function(result) {
		list = result.events;
		for(var key in list) {
			var json = JSON.parse(list[key]);
			console.log(key + ": " + list[key]);
			if(json.text.localeCompare(eEvent.text) == 0){
				list.splice(key, 1);
				break;
			}
		}
		list.push(JSON.stringify(eEvent)); 
		chrome.storage.local.set({"events": list}, function() {
			console.log("after deleting: " + list);
		})
	});
}