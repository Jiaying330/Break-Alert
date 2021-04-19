
/**
 * Tab controller
 * Removes active class from all other tabs on click
 * Add active class to clicked icon
 */
 const tabs = document.querySelectorAll('[data-tab-target]');
 const tabContents = document.querySelectorAll('[data-tab-content');
 tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = document.querySelector(tab.dataset.tabTarget);
    tabContents.forEach(tabContents => {
      tabContents.classList.remove('active');
    })
    target.classList.add('active');
  })
})


/**
 * Setting something inside local storage 
 * For testing
 * Uncomment on first run
 * Load unpacked
 * Comment out this section
 * Reload unpacked 
 */
// var myArray = [{'name': "Test 1"}, {'name': "Test 2"}, {'name': "Test 3"}, {'name': "Test 4"}, {'name': "Test 5"}]
// chrome.storage.sync.set({'myTabs': myArray}, function(){
//   console.log('Value set to ' + myArray);
// });

/**
 * Create tab code for tab controller
 * Needs more styling and content
 */
const myList = document.getElementById("allTabs");
function createTab(name){
  var myTab = document.createElement("div");
  myTab.innerHTML = name;
  return myTab;
}

/**
 * Get from local storage 
 * Ran on start of chrome launch
 * Fills out left side content
 */
 chrome.storage.sync.get(['myTabs'], function(items){
  if(typeof items.myTabs === 'undefined'){

  } else {
    console.log(items.myTabs);
    var myArray = JSON.parse(JSON.stringify(items.myTabs)); // important
    myArray.map((item) => {
      myList.append(createTab(item.name));
    });  
  }
})


/**
 * Create an X (close) button and append it to each list item
 */
var myNodeList = document.getElementsByTagName("LI");
var i;
for (i = 0; i < myNodeList.length; i++){
	var span = document.createElement("SPAN");
	var txt = document.createTextNode("\u00D7");
	span.className = "close";
	myNodeList[i].appendChild(span);
}

/**
 * Click on X (close) button to remove a list item
 */
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++){
	close[i].onclick = function() {
		var div = this.parentElement;
		div.style.display = "none";
	}
}

/**
 * Add a check when clicking on a list item
 */
var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
	if (ev.target.tagName === 'LI'){
		ev.target.classList.toggle('checked');
	}
}, false);

/**
 * Add a new button to the Todo List
 */
function newTask() {
	var li = document.createElement("li");
	var inputValue = document.getElementById("input").value;
	var t = document.createTextNode(inputValue);
	li.appendChild(t);
	if (inputValue === ''){
		alert("Input must not be empty");
	}
	else {
		document.getElementById("todoList").appendChild(li);
	}
	document.getElementById("input").value = "";

	var span = document.createElement("SPAN");
	var txt = document.createTextNode("\u00D7");
	span.className = "close";
	span.appendChild(txt);
	li.appendChild(span);

	for (i = 0; i < close.length; i++){
		close[i].onclick = function() {
			var div = this.parentElement;
			div.style.display = "none";
		}
	}
}

/**
 * Listener for add button for todo list
 */
document.addEventListener('DOMContentLoaded', function() {
	console.log("button pressed!");
  document.getElementById("addTaskListener").addEventListener("click", newTask);
});






// Jiaying's Code for Alarms
document.addEventListener('DOMContentLoaded', function () {
  var buttonSet = document.getElementById("set");
  var buttonClear = document.getElementById("clear");
  var buttonEdit = document.getElementById("edit");
  buttonSet.addEventListener("click", clickSet);
  buttonClear.addEventListener("click", clickClear); 
  buttonEdit.addEventListener("click", clickEdit);

  var buttonSetDatetime = document.getElementById("setDatetime");
  var buttonClearDatetime = document.getElementById("clearDatetime");
  var buttonEditDatetime = document.getElementById("editDatetime");
  buttonSetDatetime.addEventListener("click", clickSetDatetime);
  buttonClearDatetime.addEventListener("click", clickClearDatetime);
  buttonEditDatetime.addEventListener("click", clickEditDatetime);
});

/* 
	input: event
	function: set a loop alarm and store in local storage
*/
function clickSet(e) {
	var minutes = parseInt(document.getElementById("minute").value);
	var text = document.getElementById("loopAlarm").value;
	if(typeof minutes !=="undefined" && text != ""){
		chrome.alarms.create(text,{
			delayInMinutes : minutes, 
			periodInMinutes : minutes
		});
		var alarms = getAlarms();
		alarms.push({'text': text, 'time': minutes});
		localStorage.setItem('alarms', JSON.stringify(alarms));
	}
	else {
		alert("invalid input");
		return;
	}
}

/* 
	input: event
	function: delete a loop alarm and store in local storage
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
	var minutes = parseInt(document.getElementById("minute").value);
	chrome.alarms.get(text, function(alarm) {
		var minutes = parseInt(document.getElementById("minute").value);
		alarm.delayInMinutes = minutes;
		alarm.periodInMinutes = minutes;
	});
	editAlarm(text, minutes);
}

/* 
	input: event
	function: set an alarm with specific date/time, and store in local storage
*/
function clickSetDatetime(e) {
	var date = document.getElementById("datetime").value;
	var now = new Date();
	var timeDifference = (new Date(date)).getTime() - now.getTime();
	var text = document.getElementById("reminder").value;
	if(date != "" && timeDifference >= 0 && text != "") {
		chrome.alarms.create(text, {
			when: Number(now) + timeDifference
		});
		var alarms = getAlarms();
		
		alarms.push({'text': text, 'time': date});
		localStorage.setItem('alarms', JSON.stringify(alarms));
	}
	else {
		alert("invalid input");
		return;
	}
}

/* 
	input: event
	function: remove an alarm with specific date/time from local storage
*/
function clickClearDatetime(e) {
	console.log("button pressed!");
	var text = document.getElementById("reminder").value;
	chrome.alarms.clear(text);
	removeAlarm(text);
}

/* 
	input: event
	function: edit an alarm with specific date/time from local storage
*/
function clickEditDatetime(e) {
	var text = document.getElementById("loopAlarm").value;
	var date = document.getElementById("datetime").value;
	chrome.alarms.get(text, function(alarm){
		var date = document.getElementById("datetime").value;
		var now = new Date();
		var timeDifference = (new Date(date)).getTime() - now.getTime();
		alarm.when = Number(now) + timeDifference;
	});
	editAlarm(text, date);
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

/* 
	input: text(name) of the alarm
	function: remove an alarm with the key from the local storage 
*/
function removeAlarm(text) {
	var alarms = getAlarms();
	for(var key in alarms) {
		if(text.localeCompare(alarms[key].text) == 0) {
			console.log(key);
			console.log(alarms[key].text);
			removeAlarm(key);
			alarms.splice(key, 1);
		}
	}
	localStorage.setItem('alarms', JSON.stringify(alarms));
}

/* 
	input: text(name) of the alarm, time value of the alarm
	function: edit an alarm with the name text
*/
function editAlarm(text, time) {
	removeAlarm(text);
	var alarms = getAlarms();
	alarms.push({'text': text, 'time': time});
		localStorage.setItem('alarms', JSON.stringify(alarms));
}