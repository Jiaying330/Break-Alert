const myList = document.getElementById("allTabs");

function createTab(name, urls, pos){
	var myTab = document.createElement("div");
	myTab.className = "entireTab";
	var tabRow = document.createElement("div");
	tabRow.className = "tabRow";
	var tabName = document.createElement("div");
	tabName.innerHTML = name;
	tabName.className = "tabName";
	tabName.onclick = function (){
		chrome.storage.sync.get(["myTabs"], function(result) {
			var tabList = result.myTabs;
			var targetTab = JSON.parse(tabList[pos]);
			var urlList = (targetTab.urls);
			for(var i = 0; i < urlList.length; i++){
				chrome.tabs.create({"url": urlList[i]});
			}
		})
	};
	var dropdown = document.createElement("i");
	dropdown.className = "dropdown glyphicon glyphicon-triangle-bottom";
	dropdown.onclick = function () {
		if(dropdown.className === "dropdown glyphicon glyphicon-triangle-bottom") {
			dropdown.className = "dropdown glyphicon glyphicon-triangle-top";
			console.log(urls);
			for(var i = 0; i < urls.length; i++){
				myTab.appendChild(urlListItem(urls[i]));
			}
			myTab.appendChild(inputRow(pos, myTab));
		} else {
			dropdown.className = "dropdown glyphicon glyphicon-triangle-bottom";
			while (myTab.childElementCount !== 1){
				myTab.removeChild(myTab.lastChild);
			}
		}
	};
	tabRow.appendChild(tabName);
	tabRow.appendChild(dropdown);
	myTab.appendChild(tabRow);
	return myTab;
}

function inputRow(pos, myTab){
	var inputRow = document.createElement("div");
	inputRow.className = "inputRow";
	inputRow.appendChild(insertTabBar(pos));
	var btn = document.createElement("BUTTON");
	btn.innerHTML = "Add";
	btn.onclick = function () {
		var text = document.getElementById("input"+pos).value;
		// myTab.appendChild(urlListItem(text));
		myTab.insertBefore(urlListItem(text), myTab.children[myTab.childElementCount - 1]);
		chrome.storage.sync.get(["myTabs"], function(result) {
			var tabList = result.myTabs;
			var targetTab = JSON.parse(tabList[pos]);
			var urlList = (targetTab.urls);
			urlList.push(text);
			tabList[pos] = (JSON.stringify({
				name: targetTab.name, 
				urls: urlList
			}));
			chrome.storage.sync.set({"myTabs": tabList}, function(){
				console.log('Value set to ' + tabList);
			});
		})
	};
	inputRow.appendChild(btn);
	return inputRow;
}

function urlListItem(url){
	var listItem = document.createElement("div");
	listItem.innerHTML = url;
	return listItem;
}

{/* <input type="text" class="form-control" id="loopAlarm" placeholder="Remind me to..."> */}
function insertTabBar(pos){
	var input = document.createElement("input");
	input.setAttribute('type', 'text');
	input.setAttribute("id", "input"+pos);
	return input;
}


{/* <i class = "glyphicon glyphicon-calendar" style="cursor:pointer;" data-tab-target = "#schedule"> </i> */}

/* Fill out the tab list on start up */
var test = [];
chrome.storage.sync.get(["myTabs"], function(result) {
	if(result.myTabs == undefined){
		chrome.storage.sync.set({"myTabs": []});
	} else {
		let resultList = result.myTabs;
		for(var i = 0; i < resultList.length; i++){
			myList.appendChild(
				createTab(
					JSON.parse(resultList[i]).name,
					JSON.parse(resultList[i]).urls,
					i
				)
			);
		}
	}
});

/* Add a new multitab button listener */
document.addEventListener('DOMContentLoaded', function () {
	var buttonTabAdder = document.getElementById("addTabButton");
	buttonTabAdder.addEventListener("click", addNewMultitab);
});


// chrome.storage.sync.get(['myTabs'], function(result) {
//   console.log('Value currently is ' + result.key);
// });

/**
 * called on event
 * Creates new multi tab div to list
 * stores into local storage for future use
 */
function addNewMultitab(e) {
	let str = document.getElementById("newMTabName").value;
	if(str != ""){
		chrome.storage.sync.get(["myTabs"], function(result) {
			console.log(result.myTabs);
			var tabList = result.myTabs;
			tabList.push(JSON.stringify({
				name: str, 
				urls: ["https://www.google.com", "https://www.youtube.com", "https://www.yahoo.com"]
			}));
			chrome.storage.sync.set({"myTabs": tabList}, function(){
				console.log('Value set to ' + tabList);
			});
			myList.appendChild(
				createTab(
					str, 
					["https://www.google.com", "https://www.youtube.com", "https://www.yahoo.com"],
					tabList.length - 1
				)
			);
		});
	}
	document.getElementById("newMTabName").value = "";
}
