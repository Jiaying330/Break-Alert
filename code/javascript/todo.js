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
  var taskInput = document.getElementById("addTaskInput");
  if (taskInput != null && taskAdder != null){
    // Allow for user to hit "enter" to add the task (instead of having to click)
    taskInput.addEventListener("keyup", function(event) {
      // Number 13 is the "Enter" key on the keyboard
      // keyCode element is deprecated but it still works
      if (event.keyCode === 13) {
        // Trigger the button element with a click
        taskAdder.click();
      }
    });

    // Allow for user to click the + button to add the task
	  taskAdder.addEventListener("click", addNewTask);
  }
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
  var myTask = task;
  var li = document.createElement("li");
  var t = document.createTextNode(task);

  if (li != null && t != null){
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
          task : myTask,
          done : isFinished
        });
        chrome.storage.sync.set({"tasks": taskArr}, function(){
          console.log('Value set to ' + taskArr);
        });
      });
    }
    
    var span = document.createElement("SPAN");  // create and append the X (close button)
    var txt = document.createTextNode("\u00D7");  // to the list element in HTML
    if (span != null && txt != null){
      span.className = "close";
      span.appendChild(txt);
      span.onclick = function (){
        chrome.storage.sync.get(["tasks"], function(result) {
          var taskList = result.tasks;
          taskList[pos] = JSON.stringify({
            task : "",
            done : false
          });
          myTask = "";
          li.style = "display:none;";
          chrome.storage.sync.set({"tasks": taskList}, function(){
            console.log('Value set to ' + taskList);
          });
        })
      }
      li.appendChild(span);

      if (myTodoList != null){
        myTodoList.appendChild(li);
      }
    }
  }
}