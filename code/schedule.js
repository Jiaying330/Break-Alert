
/* Fill out the schedule on start up */
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

