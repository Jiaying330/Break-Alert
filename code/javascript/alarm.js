var aList = document.getElementById("alarmList");

if (aList != null) {
	chrome.storage.local.get({alarms: []}, function(result) {
		if (result.alarms == undefined) {
			chrome.storage.local.set({"alarms": []});
		} else {
			var resultList = result.alarms;
			var copyResultList = [];
			for (var i = 0; i < resultList.length; i++) {
				var reader = JSON.parse(resultList[i]);
				copyResultList.push(JSON.stringify(reader));
			}

			chrome.storage.local.set({"alarms": copyResultList}, function() {
				console.log('Value initiate to: ' + copyResultList);
			});

			resultList = copyResultList;
			for (var i = 0; i < resultList.length; i++) {
				aList.appendChild(
					createAlarmListElement(
						JSON.parse(resultList[i])
					)
				);
			}
		}
	});
}

function createAlarmListElement(alarm) {
	var myAlarm = document.createElement("div");
	myAlarm.className = "entireAlarm";
	var text = alarm.text;
	myAlarm.id = text;
	var li = document.createElement("li");
	li.textContent = text;
	li.className = "alarmLi";
	var buttonDelete = document.createElement("button");
	buttonDelete.innerHTML = "Delete";
	buttonDelete.className = "deleteAlarm";
	li.appendChild(buttonDelete);
	buttonDelete.addEventListener('click', function(){
		removeAlarm(text);
		var div = this.parentElement.parentElement;
		div.style.display = "none";
	});
	var dropdown = document.createElement("i");
	dropdown.className = "dropdown glyphicon glyphicon-triangle-bottom";
	dropdown.onclick = function() {
		if(dropdown.className === "dropdown glyphicon glyphicon-triangle-bottom") {
			dropdown.className = "dropdown glyphicon glyphicon-triangle-top";
			var alarmTable = document.createElement("table");
			alarmTable.appendChild(dropItem("text", alarm.text));
			alarmTable.appendChild(dropItem("time", alarm.time));
			myAlarm.appendChild(alarmTable);
		} else {
			dropdown.className = "dropdown glyphicon glyphicon-triangle-bottom";
			while(myAlarm.childElementCount != 1) {
				myAlarm.removeChild(myAlarm.lastChild);
			}
		}
	};
	li.appendChild(dropdown);
	li.addEventListener("click", function() {
		clickAlarm(alarm);
	});
	myAlarm.appendChild(li);
	return myAlarm;
}

function clickAlarm(alarm) {
	var alarmName = document.getElementById("loopAlarm");
	alarmName.value = alarm.text;
	var min = alarm.time;
	hour2 = Math.floor(alarm.time / 600);
	if(min % 600 != 0) {
		min = min - (hour2 * 600);
		hour1 = Math.floor(min / 60);
		if (min % 60 != 0) {
			min = min - (hour1 * 60);
			min2 = Math.floor(min / 10);
			if (min % 10 != 0) {
				min = min - (min2 * 10);
				min1 = min;
			}
		}
	}
	setTimeUI();
}

document.addEventListener('DOMContentLoaded', function () {
	var buttonSet = document.getElementById("set");
	//var buttonClear = document.getElementById("clear");
	var buttonEdit = document.getElementById("edit");
	buttonSet.addEventListener("click", clickSet);
	// buttonClear.addEventListener("click", clickClear); 
	buttonEdit.addEventListener("click", clickEdit);
});

/* 
	input: event
	function: set a loop alarm and store in local storage
*/
function clickSet(e) {
	var time = hour2 * 600 + hour1 * 60 + min2 * 10 + min1;
  console.log(time);
	var text = document.getElementById("loopAlarm").value;
  console.log(text);
    var repeatCheck = document.getElementById("loopCheck").checked;
  console.log(repeatCheck);
	if(time !== 0 && text != ""){
    	if(repeatCheck){
      		console.log("REPEAT");
      		chrome.alarms.create(text,{
        		delayInMinutes : time, 
        		periodInMinutes : time
      	});
		  console.log("alarm created " + text + ": " + time );
    	} else {
      		chrome.alarms.create(text,{delayInMinutes : time});
		 	console.log("alarm created " + text + ": " + time );
    	}
		addAlarms(text, time);
    	hour2 = 0;
    	hour1 = 0;
    	min2 = 0;
    	min1 = 0;
		setTimeUI();
    	document.getElementById("loopAlarm").value = "";
    	document.getElementById("loopCheck").checked = false;
		aList.appendChild(createAlarmListElement({text, time}));
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
	var time = hour2 * 600 + hour1 * 60 + min2 * 10 + min1;
	chrome.alarms.get(text, function(alarm) {
		alarm.delayInMinutes = time;
		alarm.periodInMinutes = time;
	});
	editAlarm(text, time);
	for (var i = 0; i < aList.childNodes.length; i++) {
		if(aList.childNodes[i].id == text) {
			aList.childNodes[i].style.display = "none";
			aList.removeChild(aList.childNodes[i]);
		}
	}
	aList.appendChild(createAlarmListElement({text, time}));
}

/* 
	input: text(name) and time of the alarm
	function: add an alarm to the local storage 
*/
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