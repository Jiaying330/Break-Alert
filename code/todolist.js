 /**
  * Run when extension opens.
  * Fill in tasks in todo list from Chrome storage
  */
 chrome.storage.sync.get(["tasks"], function(result){
   if(result.tasks == undefined){
     chrome.storage.sync.set({"tasks": []});  // "tasks" DNE, so initialize it
   }
   else {
     var taskList = result.tasks;
     var taskCopyList = ["yes", "sir"];
     for (var i = 0; i < taskList.length; i++){
       var reader = JSON.parse(taskList[i]);
       if (reader.name !== ""){  // if non empty task string, push it to copy list
         taskCopyList.push(JSON.stringify({
           name: reader.name,
         }));
       }
     } // end for
     chrome.storage.sync.set({"tasks": taskCopyList}, function(){
       console.log("tasks set to " + taskCopyList);
     })

     // load in the tasks into the page
     for (var i = 0; i < taskCopyList.length; i++){
       myTodoList.appendChild(
         newTask(
           JSON.parse(taskCopyList[i]).name,
           i
         )
       )
     }  
   } // end else
 });

 
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
 

//  /**
//   * 
//   * @param {String} name 
//   * @param {Number} pos 
//   * @returns A singular task
//   * 
//   */

// function createTask(name, pos){
//   var myTask = document.createElement("div");
//   myTask.className = "entireTask";
//   var taskName = document.createElement("div");
//   taskName.className = "taskName";
//   taskName.innerHTML = name;
  
// } // end createTask()


 /**
  * Add a new button to the Todo List
  */
const myTodoList = document.getElementById("todoList");
 function newTask(name, pos) {
   var li = document.createElement("li");
   var inputValue = document.getElementById("input").value;
   var t = document.createTextNode(inputValue);
   li.appendChild(t);
   if (inputValue === ''){
     alert("Input must not be empty");
   }
   else {
     myTodoList.appendChild(li);
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

   return myTodoList;
 }
 
 /**
  * Listener for add button for todo list
  */
 document.addEventListener('DOMContentLoaded', function() {
   document.getElementById("addTaskListener").addEventListener("click", newTask);
 });