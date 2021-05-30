var myTodoList = document.getElementById("todoList");

chrome.storage.sync.get({tasks: []}, function(result) {
	if(result.tasks == undefined){
		chrome.storage.sync.set({"tasks": []});
	} else {
		var taskList = result.tasks;
		var taskCopyList = [];
    var counter = 0;
		for(var i = 0; i < taskList.length; i++){
			var reader = JSON.parse(taskList[i]);
			if(reader.task !== ""){
				taskCopyList.push(JSON.stringify({
          task: reader.task, 
          done: reader.done
				}));
        createTaskItem(reader.task, reader.done, counter);
        counter += 1;
			}
		}
		chrome.storage.sync.set({"tasks": taskCopyList}, function(){
			console.log('Value set to ' + taskCopyList);	
		});
	}
});

document.addEventListener('DOMContentLoaded', function () {
	var taskAdder = document.getElementById("addTaskListener");
	taskAdder.addEventListener("click", addNewTask);
});

function addNewTask(){
  let str = document.getElementById("addTaskInput").value;
  if(str != ""){
    chrome.storage.sync.get({tasks: []}, function(result) {
      var taskArr = result.tasks;
      taskArr.push(JSON.stringify({
        task: str, 
        done: false
      }));
      chrome.storage.sync.set({"tasks": taskArr}, function(){
        console.log('Value set to ' + taskArr);
      });
      createTaskItem(str, false, taskArr.length - 1);
    });
  }
  document.getElementById("addTaskInput").value = "";
} 

function createTaskItem(task, done, pos){
  var li = document.createElement("li");
  var t = document.createTextNode(task);
  li.appendChild(t);
  if(done){
    li.classList.toggle('checked');
  }
	li.onclick = function () {
    li.classList.toggle('checked');
    chrome.storage.sync.get({tasks: []}, function(result) {
      var taskArr = result.tasks;
      var reader = JSON.parse(taskArr[pos]);
      var isFinished = !reader.done;
      taskArr[pos] = JSON.stringify({
        task : reader.task,
        done : isFinished
      });
      chrome.storage.sync.set({"tasks": taskArr}, function(){
        console.log('Value set to ' + taskArr);
      });
    });
  }
  myTodoList.appendChild(li);
}



// var myTodoList = document.getElementById("todoList");

// // uncomment this to clear all tasks from todo list
//   // chrome.storage.sync.clear();

// /**
//   * Add handlers for each tasks' X button.
//   * Click on X (close) button to remove a list item.
//   * This function should 
//   */
//  function addCloseHandlers() {
//   var close = document.getElementsByClassName("close");

//   for (var j = 0; j < close.length; j++){  // add handler for when X is clicked for an li
//     close[j].onclick = function() {    
//       // delete the element from the ul list
//       var taskName = this.title;
//       this.parentElement.parentElement.removeChild(this.parentElement);

//       chrome.storage.sync.get({tasks: []}, function(result) {
//         var taskArr = result.tasks;
        
//         // get index of the task to delete
//         var delIndex;
//         for (delIndex = 0; delIndex < taskArr.length && taskArr[delIndex] !== taskName; delIndex++){}
        
//         // delete the element from Chrome storage
//         taskArr.splice(delIndex, 1); // remove 1 element at index "pos" (ie. at delIndex)
//         chrome.storage.sync.set({"tasks": taskArr}, function(){
//           // console.log("after deleting: " + taskArr);
//         });  // end set
//       });  // end get

//     } // end close
//   } // end for
  
// }

//  /**
//   * Load in previously stored tasks from Chrome Storage
//   * (automatically called at start of Extension)
//   */
//   chrome.storage.sync.get({tasks: []}, function(result) {
//     var taskArr = result.tasks;

//     // console.log('Tasks currently are ' + taskArr);

//     for (var i = 0; i < taskArr.length; i++){  // loop through tasks and add to list
//       var singleTask = document.createElement("li");
//       if (singleTask){
//         singleTask.append(document.createTextNode(taskArr[i]));
//       }
//       if (myTodoList)
//         myTodoList.appendChild(singleTask);

//       var span = document.createElement("SPAN");  // create and append the X (close button)
//       var txt = document.createTextNode("\u00D7");  // to the list element in HTML
//       span.className = "close";
//       span.title = taskArr[i];
//       span.appendChild(txt);
//       singleTask.appendChild(span);
//     }  // end for

//     // call helper function containing a loop that adds handler to all X buttons
//     addCloseHandlers(); 
//   });  // end get


  
  
//   /**
//    * Add a check when clicking on a list item
//    */
//   var list = document.querySelector('#todoList');
//   if (list) {
//     list.addEventListener('click', function(ev) {
//       if (ev.target.tagName === 'LI'){
//         ev.target.classList.toggle('checked');
//       }
//     }, false);
//   }
  

//   /**
//    * Add a new button to the Todo List
//    */
//   function newTask() {
//     var li = document.createElement("li");
//     var inputValue = document.getElementById("input").value;
//     var t = document.createTextNode(inputValue);
//     li.appendChild(t);
//     if (inputValue === ''){
//       alert("Input must not be empty");
//     }
//     else {
//       myTodoList.appendChild(li);

//       chrome.storage.sync.get({tasks: []}, function(result) {
//         var taskArr = result.tasks;
    
//         taskArr.push(inputValue); // push a task to arr and add it to chrome storage
//         chrome.storage.sync.set({"tasks": taskArr});
    
//         // console.log('Tasks currently is/are now ' + taskArr);
//       });

//     }
//     document.getElementById("input").value = "";  // reset the input text box
  
//     var span = document.createElement("SPAN");  // create and append the X (close button)
//     var txt = document.createTextNode("\u00D7");  // to the list element in HTML
//     span.className = "close";
//     span.title = inputValue;
//     span.appendChild(txt);
//     li.appendChild(span);
  
//     // call helper function containing a loop that adds handler to all X buttons
//     addCloseHandlers();
//   }
  
//   /**
//    * Listener for add button for todo list
//    */
//   document.addEventListener('DOMContentLoaded', function() {
//     var doc = document.getElementById("addTaskListener");
//     if (doc) 
//       doc.addEventListener("click", newTask);
//   });