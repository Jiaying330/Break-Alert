
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
  document.getElementById("addTaskListener").addEventListener("addBtn", newTask);
});






// Jiaying's Code for Alarms
document.addEventListener('DOMContentLoaded', function () {
  var buttonSet = document.getElementById("set");
  var buttonClear = document.getElementById("clear");
  buttonSet.addEventListener("click", clickSet);
  buttonClear.addEventListener("click", clickClear); 

  var buttonSetDatetime = document.getElementById("setDatetime");
  var buttonClearDatetime = document.getElementById("clearDatetime");
  buttonSetDatetime.addEventListener("click", clickSetDatetime);
  buttonClearDatetime.addEventListener("click", clickClearDatetime);
});

// set a loop alarm
function clickSet(e) {
	var minutes = parseInt(document.getElementById("minute").value);
	if(typeof minutes !=="undefined"){
		chrome.alarms.create("breakAlarm",{
			delayInMinutes : minutes, 
			periodInMinutes : minutes
		});
	}
	window.close();
}

//delete a loop alarm
function clickClear(e){
	chrome.alarms.clear("breakAlarm");
	window.close();
}

/* 
	input: event
	function: set an alarm with specific date/time, and store in local storage
*/
function clickSetDatetime(e) {
	var date = document.getElementById("datetime").value;
	var now = new Date();
	var timeDifference = (new Date(date)).getTime() - now.getTime();
	if(date != "" && timeDifference >= 0) {
		var text = document.getElementById("reminder").value;
		chrome.alarms.create(text, {
			when: Number(now) + timeDifference
		});
		var alarms = getAlarms();
		
		alarms.push({'text': text, 'time': date});
		localStorage.setItem('alarms', JSON.stringify(alarms));
	}
}

/* 
	input: event
	function: remove an alarm with specific date/time from local storage
*/
function clickClearDatetime(e) {

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
	input: key
	function: remove an alarm with the key from the local storage 
*/
function removeAlarm(key) {
	var alarms = getAlarms();
	alarms.splice(key, 1);
	localStorage.setItem('alarms', JSON.stringify(alarms));
}

// function listAllAlarms() {
// 	var content = '<div class="border-div"></div>';
// 	var alarms = getAlarms();
// 	if(alarms.length == 0) {
// 		content += 'No alarms set';
// 	}
// 	for(var key in alarms) {
// 		var date = new Date(alarms[key].time);
// 		content +='<div class="border-div"><div class="clearfix task"><span class="dark left">'+alarms[key].text+'</span><span class="right crimson removeReminder" data-key="'+key+'"><i class="fa fa-times-circle-o"></i></span><span class="right">'+formatAMPM(date)+'</span></div></div>';
// 	}
// }

// function formatAMPM(date) {
// 	"use strict";
// 	var hours = date.getHours();
// 	var minutes = date.getMinutes();
// 	var ampm = hours >= 12 ? 'pm' : 'am';
// 	hours = hours % 12;
// 	hours = hours ? hours : 12; // the hour '0' should be '12'
// 	minutes = minutes < 10 ? '0'+minutes : minutes;
// 	var strTime = hours + ':' + minutes + ' ' + ampm;
	
// 	strTime = (date.getMonth()+1)+'/'+date.getDate()+' '+strTime;
// 	return strTime;
// }

