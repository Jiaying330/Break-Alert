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