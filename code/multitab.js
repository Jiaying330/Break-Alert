const myList = document.getElementById("allTabs");
function createTab(name, urls){
	var myTab = document.createElement("div");
	myTab.className = "multiTabButton";
	myTab.innerHTML = name;
	// myTab.test = "hello";
	myTab.onclick = function () {
		console.log(urls);
		for(var i = 0; i < urls.length; i++){
			chrome.tabs.create({"url": urls[i]});
		}
	};
	return myTab;
}

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
					JSON.parse(resultList[i]).urls
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
		});
		myList.appendChild(
			createTab(
				str, 
				["https://www.google.com", "https://www.youtube.com", "https://www.yahoo.com"]
			)
		);
	}
	document.getElementById("newMTabName").value = "";
}
