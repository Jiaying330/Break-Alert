var myTodoList = document.getElementById("todoList");
 
 /**
  * Load in previously stored tasks from Chrome Storage
  */
  chrome.storage.sync.get('tasks', function(result) {
    console.log('Tasks currently is ' + result.tasks);
    if (result.tasks === undefined){
      chrome.storage.sync.set({"tasks": "yeet"}, function() {
        console.log('Value is set to ');
        console.log(result);
        console.log(result.tasks);

      });
    }
  });

  var singleTask = document.createElement("li");
  if (singleTask)
    singleTask.append(document.createTextNode("first task"));
  if (myTodoList)
    myTodoList.appendChild(singleTask);
  var span = document.createElement("SPAN");  // create and append the X (close button)
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  singleTask.appendChild(span);
  for (i = 0; i < close.length; i++){  // delete the task when the X is clicked
    close[i].onclick = function() {
      var div = this.parentElement;
      div.style.display = "none";
    }
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