
chrome.storage.sync.get(["visual"], function(result) {
	if(result.visual == undefined){
		chrome.storage.sync.set({"visual": "light"});
	} else {
        if(result.visual == "light"){
            toggleLightMode();
        }else{
            toggleDarkMode();
        }
	}
});
document.addEventListener('DOMContentLoaded', function () {
	document.getElementById("openVisualSettings").addEventListener("click", openVisualSettings);
	document.getElementById("resetMultiTabData").addEventListener("click", resetMultiTabData);
	document.getElementById("resetTodoData").addEventListener("click", resetTodoData);
	document.getElementById("toggleDarkMode").addEventListener("click", toggleDarkMode);
	document.getElementById("toggleLightMode").addEventListener("click", toggleLightMode);
});

function resetMultiTabData(){
    chrome.storage.sync.set({"myTabs": []});
    const myList = document.getElementById("allTabs");
    while (myList.childElementCount !== 0){
        myList.removeChild(myList.lastChild);
    }
}
function resetTodoData(){
    chrome.storage.sync.set({"tasks": []});
    const myTodoList = document.getElementById("todoList");
    while (myTodoList.childElementCount !== 0){
        myTodoList.removeChild(myTodoList.lastChild);
    }
}
const visualSettings = document.getElementById('visualSettings');
const settings = document.getElementById('settings');
function openVisualSettings(){
    settings.classList.remove('active');
    visualSettings.classList.add('active');
}

const bodyID = document.getElementById('chromeExtension');
function toggleDarkMode(){
    bodyID.classList.add('darkMode');
    document.querySelectorAll('.inverted').forEach((result)=>{
        result.classList.add('invert');
    })
    chrome.storage.sync.set({"visual": "dark"});
}
function toggleLightMode(){
    bodyID.classList.remove('darkMode');
    document.querySelectorAll('.inverted').forEach((result)=>{
        result.classList.remove('invert');
    })
    chrome.storage.sync.set({"visual": "light"});
}