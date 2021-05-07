document.addEventListener('DOMContentLoaded', function () {
	var buttonSet = document.getElementById("set");
	var buttonClear = document.getElementById("clear");
	var buttonEdit = document.getElementById("edit");
	buttonSet.addEventListener("click", clickSet);
	buttonClear.addEventListener("click", clickClear); 
	buttonEdit.addEventListener("click", clickEdit);
});

/* 
	input: event
	function: set a loop alarm and store in local storage
*/
function clickSet(e) {
	var minutes = hour2 * 600 + hour1 * 60 + min2 * 10 + min1;
  console.log(minutes);
	var text = document.getElementById("loopAlarm").value;
  console.log(text);
    var repeatCheck = document.getElementById("loopCheck").checked;
  console.log(repeatCheck);
	if(minutes !== 0 && text != ""){
    	if(repeatCheck){
      		console.log("REPEAT");
      		chrome.alarms.create(text,{
        		delayInMinutes : minutes, 
        		periodInMinutes : minutes
      	});
    //   var alarms = getAlarms();
    //   alarms.push({'text': text, 'time': minutes});
    //   localStorage.setItem('alarms', JSON.stringify(alarms));
    	} else {
      		chrome.alarms.create(text,{delayInMinutes : minutes});
    	}
		addAlarms(text, minutes);
    	hour2 = 0;
    	hour1 = 0;
    	min2 = 0;
    	min1 = 0;
		setTimeUI();
    	document.getElementById("loopAlarm").value = "";
    	document.getElementById("loopCheck").checked = false;
	}
}
/* 
	input: event
	function: delete a loop alarm and update in local storage
*/
function clickClear(e){
	var text = document.getElementById("loopAlarm").value;
	chrome.alarms.clear(text);
	removeAlarm(text);
}

/* 
	input: event
	function: edit a loop alarm and store in local storage
*/
function clickEdit(e){
	var text = document.getElementById("loopAlarm").value;
	var minutes = hour2 * 600 + hour1 * 60 + min2 * 10 + min1;
	// var minutes = parseInt(document.getElementById("minute").value);
	chrome.alarms.get(text, function(alarm) {
		// var minutes = parseInt(document.getElementById("minute").value);
		alarm.delayInMinutes = minutes;
		alarm.periodInMinutes = minutes;
	});
	editAlarm(text, minutes);
}

function addAlarms(text, time) {
	chrome.storage.local.get({alarms: []}, function(result) {
		var list = result.alarms;
		list.push(JSON.stringify({'text': text, 'time': time}));
		chrome.storage.local.set({"alarms": list}, function() {
			console.log('value set to ' + list);
		});
	});
}
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

// document.addEventListener('DOMContentLoaded', function () {
//   var buttonSet = document.getElementById("set");
//   var buttonClear = document.getElementById("clear");
//   var buttonEdit = document.getElementById("edit");
//   buttonSet.addEventListener("click", clickSet);
//   buttonClear.addEventListener("click", clickClear); 
//   buttonEdit.addEventListener("click", clickEdit);

//   var buttonSetDatetime = document.getElementById("setDatetime");
//   var buttonClearDatetime = document.getElementById("clearDatetime");
//   var buttonEditDatetime = document.getElementById("editDatetime");
//   buttonSetDatetime.addEventListener("click", clickSetDatetime);
//   buttonClearDatetime.addEventListener("click", clickClearDatetime);
//   buttonEditDatetime.addEventListener("click", clickEditDatetime);
// });

// /* 
// 	input: event
// 	function: set a loop alarm and store in local storage
// */
// function clickSet(e) {
// 	var minutes = hour2 * 600 + hour1 * 60 + min2 * 10 + min1;
// 	// var minutes = parseInt(document.getElementById("minute").value);
// 	var text = document.getElementById("loopAlarm").value;
// 	if(minutes !== 0 && text != ""){
// 		chrome.alarms.create(text,{
// 			delayInMinutes : minutes, 
// 			periodInMinutes : minutes
// 		});
// 		var alarms = getAlarms();
// 		alarms.push({'text': text, 'time': minutes});
// 		localStorage.setItem('alarms', JSON.stringify(alarms));
// 	}
// 	else {
// 		alert("invalid input");
// 		return;
// 	}
// }

// /* 
// 	input: event
// 	function: delete a loop alarm and store in local storage
// */
// function clickClear(e){
// 	var text = document.getElementById("loopAlarm").value;
// 	chrome.alarms.clear(text);
// 	removeAlarm(text);
// }

// /* 
// 	input: event
// 	function: edit a loop alarm and store in local storage
// */
// function clickEdit(e){
// 	var text = document.getElementById("loopAlarm").value;
// 	var minutes = parseInt(document.getElementById("minute").value);
// 	chrome.alarms.get(text, function(alarm) {
// 		var minutes = parseInt(document.getElementById("minute").value);
// 		alarm.delayInMinutes = minutes;
// 		alarm.periodInMinutes = minutes;
// 	});
// 	editAlarm(text, minutes);
// }

// /* 
// 	input: event
// 	function: set an alarm with specific date/time, and store in local storage
// */
// function clickSetDatetime(e) {
// 	var date = document.getElementById("datetime").value;
// 	var now = new Date();
// 	var timeDifference = (new Date(date)).getTime() - now.getTime();
// 	var text = document.getElementById("reminder").value;
// 	if(date != "" && timeDifference >= 0 && text != "") {
// 		chrome.alarms.create(text, {
// 			when: Number(now) + timeDifference
// 		});
// 		var alarms = getAlarms();
		
// 		alarms.push({'text': text, 'time': date});
// 		localStorage.setItem('alarms', JSON.stringify(alarms));
// 	}
// 	else {
// 		alert("invalid input");
// 		return;
// 	}
// }

// /* 
// 	input: event
// 	function: remove an alarm with specific date/time from local storage
// */
// function clickClearDatetime(e) {
// 	console.log("button pressed!");
// 	var text = document.getElementById("reminder").value;
// 	chrome.alarms.clear(text);
// 	removeAlarm(text);
// }

// /* 
// 	input: event
// 	function: edit an alarm with specific date/time from local storage
// */
// function clickEditDatetime(e) {
// 	var text = document.getElementById("loopAlarm").value;
// 	var date = document.getElementById("datetime").value;
// 	chrome.alarms.get(text, function(alarm){
// 		var date = document.getElementById("datetime").value;
// 		var now = new Date();
// 		var timeDifference = (new Date(date)).getTime() - now.getTime();
// 		alarm.when = Number(now) + timeDifference;
// 	});
// 	editAlarm(text, date);
// }

// /* 
// 	output: returns a list of alarms stored in local storage
// 	functon: gets a list of alarms stored in local storage
// */
// function getAlarms() {
// 	var alarms = localStorage.getItem('alarms');
// 	if(!alarms) {
// 		alarms = [];
// 	} else {
// 		alarms = JSON.parse(alarms);
// 	}
// 	return alarms;
// }

/* 
	input: text(name) of the alarm
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
	// var alarms = getAlarms();
	// for(var key in alarms) {
	// 	if(text.localeCompare(alarms[key].text) == 0) {
	// 		console.log(key);
	// 		console.log(alarms[key].text);
	// 		// removeAlarm(key);
	// 		alarms.splice(key, 1);
	// 	}
	// }
	// localStorage.setItem('alarms', JSON.stringify(alarms));
}

/* 
	input: text(name) of the alarm, time value of the alarm
	function: edit an alarm with the name text
*/
function editAlarm(text, time) {
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
		list.push(JSON.stringify({'text': text, 'time': time}));
		chrome.storage.local.set({"alarms": list}, function() {
			console.log("after editing: " + list);
		});
	});
	// removeAlarm(text);
	// var alarms = getAlarms();
	// alarms.push({'text': text, 'time': time});
	// 	localStorage.setItem('alarms', JSON.stringify(alarms));
}


/**
 * Alarm UI Code
 */

/* Alarm UI button listener */
document.addEventListener('DOMContentLoaded', function () {
	document.getElementById("hour2_up").addEventListener("click", addHour2);
	document.getElementById("hour2_down").addEventListener("click", subHour2);
	document.getElementById("hour1_up").addEventListener("click", addHour1);
	document.getElementById("hour1_down").addEventListener("click", subHour1);
	document.getElementById("min2_up").addEventListener("click", addMin2);
	document.getElementById("min2_down").addEventListener("click", subMin2);
	document.getElementById("min1_up").addEventListener("click", addMin1);
	document.getElementById("min1_down").addEventListener("click", subMin1);
});

var hour2 = 0;
var hour1 = 0;
var min2 = 0;
var min1 = 0;

function addHour2(){
	if(hour2 <= 8){
		hour2 += 1;
	}
	setTimeUI();
}
function subHour2(){
	if(hour2 > 0){
		hour2 -= 1;
	}
	setTimeUI();
}
function addHour1(){
	if(hour1 <= 8){
		hour1 += 1;
	}else{
		if(hour2 != 9){
			hour2 += 1;
			hour1 = 0;
		}
	}
	setTimeUI();
}
function subHour1(){
	if(hour1 > 0){
		hour1 -= 1;
	} else {
		if(hour2 != 0){
			hour2 -= 1;
			hour1 = 9;
		}
	}
	setTimeUI();
}
function addMin2(){
	if(min2 <= 4){
		min2 += 1;
	}
	setTimeUI();
}
function subMin2(){
	if(min2 > 0){
		min2 -= 1;
	}
	setTimeUI();
}
function addMin1(){
	if(min1 <= 8){
		min1 += 1;
	}else{
		if(min2 != 5){
			min2 += 1;
			min1 = 0;
		}
	}
	setTimeUI();
}
function subMin1(){
	if(min1 > 0){
		min1 -= 1;
	} else {
		if(min2 != 0){
			min2 -= 1;
			min1 = 9;
		}
	}
	setTimeUI();
}

function setTimeUI(){
	document.getElementById("hour2").innerHTML = hour2;
	document.getElementById("hour1").innerHTML = hour1;
	document.getElementById("min2").innerHTML = min2;
	document.getElementById("min1").innerHTML = min1;
}