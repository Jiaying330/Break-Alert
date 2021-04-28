var myTodoList = document.getElementById("todoList");

// uncomment this to clear all tasks from todo list
  // chrome.storage.sync.clear();

/**
  * Click on X (close) button to remove a list item
  */
 function deleteTask() {
  var close = document.getElementsByClassName("close");

  chrome.storage.sync.get({tasks: []}, function(result) {
    var taskArr = result.tasks;

    for (var j = 0; j < close.length; j++){
      close[j].onclick = function() {    
        // delete the element from the ul list
        var div = this.parentElement;
        div.style.display = "none";

        // get index of the element to delete
        var delIndex;
        for (delIndex = 0; delIndex < taskArr.length && taskArr[delIndex] !== this.title; delIndex++){}
        console.log(delIndex);
        
        // delete the element from Chrome storage
        taskArr.splice(delIndex, 1); // remove 1 element at index "pos" (ie. at delIndex)
        chrome.storage.sync.set({"tasks": taskArr}, function(){
          console.log("after deleting: " + taskArr);
        });
    
      } // end close
    } // end for
  });
}

 /**
  * Load in previously stored tasks from Chrome Storage
  * (automatically called at start of Extension)
  */
  chrome.storage.sync.get({tasks: []}, function(result) {
    var taskArr = result.tasks;

    console.log('Tasks currently are ' + taskArr);

    for (var i = 0; i < taskArr.length; i++){  // loop through tasks and add to list
      var singleTask = document.createElement("li");
      if (singleTask){
        console.log(i + " is " + taskArr[i]);
        singleTask.append(document.createTextNode(taskArr[i]));
      }
      if (myTodoList)
        myTodoList.appendChild(singleTask);

      var span = document.createElement("SPAN");  // create and append the X (close button)
      var txt = document.createTextNode("\u00D7");  // to the list element in HTML
      span.className = "close";
      span.title = taskArr[i];
      span.appendChild(txt);
      singleTask.appendChild(span);

      deleteTask();
    }  // end for
  });  // end get


  deleteTask(); // call helper function containing a loop that deletes clicked tasks
  
  
  /**
   * Add a check when clicking on a list item
   */
  var list = document.querySelector('ul');
  if (list) {
    list.addEventListener('click', function(ev) {
      if (ev.target.tagName === 'LI'){
        ev.target.classList.toggle('checked');
      }
    }, false);
  }
  

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
      myTodoList.appendChild(li);

      chrome.storage.sync.get({tasks: []}, function(result) {
        var taskArr = result.tasks;
    
        taskArr.push(inputValue); // push a task to arr and add it to chrome storage
        chrome.storage.sync.set({"tasks": taskArr});
    
        console.log('Tasks currently is now ' + taskArr);
      });

    }
    document.getElementById("input").value = "";  // reset the input text box
  
    var span = document.createElement("SPAN");  // create and append the X (close button)
    var txt = document.createTextNode("\u00D7");  // to the list element in HTML
    span.className = "close";
    span.title = inputValue;
    span.appendChild(txt);
    li.appendChild(span);
  
    deleteTask();  // call helper function containing a loop that deletes clicked tasks
  }
  
  /**
   * Listener for add button for todo list
   */
  document.addEventListener('DOMContentLoaded', function() {
    var doc = document.getElementById("addTaskListener");
    if (doc) 
      doc.addEventListener("click", newTask);
  });

