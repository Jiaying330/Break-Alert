var myTodoList = document.getElementById("todoList");
 
// uncomment this to clear all tasks from todo list
  // chrome.storage.sync.clear();

 /**
  * Load in previously stored tasks from Chrome Storage
  */
  chrome.storage.sync.get({tasks: []}, function(result) {
    var taskArr = result.tasks;

    // taskArr.push("yeet"); // push a task to arr and add it to chrome storage
    // chrome.storage.sync.set({"tasks": taskArr});

    console.log('Tasks currently is ' + taskArr);
    
    // if (taskArr.length === 0){
    //   taskArr.push("yeet2");
    //   console.log("after pushing:" + taskArr);
    //   chrome.storage.sync.set({"tasks": taskArr}, function(){
    //     console.log("success!" + taskArr);
    //   });
    //   console.log("after: " + taskArr);
    // }
    // console.log("length = " + taskArr.length);

    for (var i = 0; i < taskArr.length; i++){  // loop through tasks and add to list
      var singleTask = document.createElement("li");
      if (singleTask){
        console.log(i + " is " + taskArr[i]);
        singleTask.append(document.createTextNode(taskArr[i]));
      }
      if (myTodoList)
        myTodoList.appendChild(singleTask);
      var span = document.createElement("SPAN");  // create and append the X (close button)
      var txt = document.createTextNode("\u00D7");
      span.className = "close";
      span.title = taskArr[i];
      span.appendChild(txt);
      singleTask.appendChild(span);
      for (i = 0; i < close.length; i++){  // delete the task when the X is clicked
        close[i].onclick = function() {
          var div = this.parentElement;
          div.style.display = "none";
          // console.log("parentElement = " + this.title);
          // chrome.storage.sync.remove({"tasks": this.title});
        }
      }
    }
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
    var doc = document.getElementById("addTaskListener");
    if (doc) 
      doc.addEventListener("click", newTask);
  });