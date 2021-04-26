/**
 * Runs when extension opens
 * Garbage collection on removed multitabs/urls
 * Creates the multitab buttons
 * Sets Chrome storage "myTabs" to [] if undefined
 */
 var test = [];
 chrome.storage.sync.get(["myTabs"], function(result) {
	 if(result.myTabs == undefined){
		 chrome.storage.sync.set({"myTabs": []});
	 } else {
	 var tabList = result.myTabs;
	 var tabCopyList = [];
	 for(var i = 0; i < tabList.length; i++){
	   var reader = JSON.parse(tabList[i]);
	   if(reader.name !== ""){
		 var urlList = (reader.urls).filter(j => j !== "");
		 console.log(urlList);
		 tabCopyList.push(JSON.stringify({
		   name: reader.name, 
		   urls: urlList
		 }));
	   }
	 }
	 console.log(tabCopyList);
	 chrome.storage.sync.set({"myTabs": tabCopyList}, function(){
	   console.log('Value set to ' + tabCopyList);
	 });
 
		 let resultList = tabCopyList;
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
 
  /**
   * 
   * @param {String} name 
   * @param {Array} urls 
   * @param {Number} pos 
   * @returns A singular tab
   * 
   */
 document.addEventListener('DOMContentLoaded', function () {
	 var buttonTabAdder = document.getElementById("addTabButton");
	 buttonTabAdder.addEventListener("click", addNewMultitab);
 });
 
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
		 if (urlList[i] !== ""){
				   chrome.tabs.create({"url": urlList[i]});
		 }
			 }
		 })
	 };
	 var dropdown = document.createElement("i");
	 dropdown.className = "dropdown glyphicon glyphicon-triangle-bottom";
	 dropdown.onclick = function () {
		 if(dropdown.className === "dropdown glyphicon glyphicon-triangle-bottom") {
			 chrome.storage.sync.get(["myTabs"], function(result) {
				 var myTabsList = result.myTabs;
				 var urlList = JSON.parse(myTabsList[pos]).urls;
				 dropdown.className = "dropdown glyphicon glyphicon-triangle-top";
				 console.log(urlList);
				 for(var i = 0; i < urlList.length; i++){
				   myTab.appendChild(urlListItem(urlList[i], pos, i));
				 }
				 myTab.appendChild(inputRow(pos, myTab));
				 var deleteButton = document.createElement("div");
				 deleteButton.innerHTML = "Delete";
		 deleteButton.style = "cursor: pointer;"; 
				 deleteButton.onclick = function () {
		   myTabsList[pos] = JSON.stringify({
			 name : '',
			 urls : [] 
		   });
		   myTab.style = "display:none;"
					 console.log(myTabsList);
 
		   chrome.storage.sync.set({"myTabs": myTabsList}, function(){
			 console.log('Value set to ' + myTabsList);
		   });
				 }
				 myTab.appendChild(deleteButton);
				 
			 })
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
 
  /**
   * 
   * @param {Number} pos 
   * @param {Object} myTab 
   * @returns InputField to add new URLs to multitab
   * 
   * Input Field with Add Button 
   * 
   */
 function inputRow(pos, myTab){
	 var inputRow = document.createElement("div");
	 inputRow.className = "inputRow";
	 inputRow.appendChild(insertTabBar(pos));
	 var btn = document.createElement("BUTTON");
	 btn.innerHTML = "Add";
	 btn.onclick = function () {
		 var text = document.getElementById("input"+pos).value;
		 // myTab.appendChild(urlListItem(text));
		 myTab.insertBefore(urlListItem(text, pos, myTab.childElementCount - 3), myTab.children[myTab.childElementCount - 2]);
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
 
  /**
   * 
   * @param {String} url 
   * @param {number} pos 
   * @param {number} linkNum 
   * @returns URL display under the multitab button
   * 
   * Currently just black unclickable/editable text with a remove button
   * 
   */
 function urlListItem(url, pos, linkNum){
	 var listItem = document.createElement("div");
	 // listItem.innerHTML = url;
	 listItem.className = "listItemRow";
	 listItem.style = "display:flex;";
   if(url === ""){
	 listItem.style = "display:flex; display:none;"
   }
	 listItem.innerHTML = url;
	 var deleteButton = document.createElement("i");
	 deleteButton.className = "deleteButton glyphicon glyphicon-remove";
	 listItem.appendChild(deleteButton);
	 deleteButton.onclick = function(){
		 chrome.storage.sync.get(["myTabs"], function(result) {
			 var tabList = result.myTabs;
	   var targetTab = (JSON.parse(tabList[pos]));
	   var urlList = targetTab.urls;
	   urlList.splice(linkNum, 1, "");
	   console.log(linkNum);
	   listItem.style = "display:flex; display:none;"
			 tabList[pos] = (JSON.stringify({
				 name: targetTab.name, 
				 urls: urlList
			 }));
			 chrome.storage.sync.set({"myTabs": tabList}, function(){
				 console.log('Value set to ' + tabList);
			 });
	   
	 })
	 };
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
 