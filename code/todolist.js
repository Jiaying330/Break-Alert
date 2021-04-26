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
   document.getElementById("input").value = "";  // reset the input text box
 
   var span = document.createElement("SPAN");  // create and append the X (close button)
   var txt = document.createTextNode("\u00D7");
   span.className = "close";
   span.appendChild(txt);
   li.appendChild(span);
 
   for (i = 0; i < close.length; i++){  // delete the task when the X is clicked
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
   document.getElementById("addTaskListener").addEventListener("click", newTask);
 });