
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






/* 
	input: event
	function: remove an alarm with specific date/time from local storage
*/
function clickClearDatetime(e) {

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