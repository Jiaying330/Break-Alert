/**
 * Temporary workaround for secondary monitors on MacOS where redraws don't happen
 * @See https://bugs.chromium.org/p/chromium/issues/detail?id=971701
 */
if (window.screenLeft < 0 || window.screenTop < 0 || window.screenLeft > window.screen.width || window.screenTop > window.screen.height) {
    chrome.runtime.getPlatformInfo(function (info) {
        if (info.os === 'mac') {
            const fontFaceSheet = new CSSStyleSheet()
            fontFaceSheet.insertRule(
                `
                @keyframes redraw {
                    0% {
                        opacity: 1;
                    }
                    100% {
                        opacity: .99;
                    }
                }
                `
            )
            fontFaceSheet.insertRule(
                `
                html {
                    animation: redraw 1s linear infinite;
                }
                `
            )
            document.adoptedStyleSheets = [
                ...document.adoptedStyleSheets,
                fontFaceSheet,
            ]
        }
    })
}

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
    document.getElementById("resetAlarmData").addEventListener("click", resetAlarmData);
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
const leftClass = document.getElementsByClassName('left');
const rightClass = document.getElementsByClassName('right');
const solidClass = document.getElementsByClassName('solid');
const middleClass = document.getElementsByClassName('middle');
const inputFields = document.getElementsByTagName('input');
const textFields = document.getElementsByTagName('textarea');
const labelFields = document.getElementsByTagName('label');
function toggleDarkMode(){
    bodyID.style.backgroundColor = "#282828";
    leftClass[0].style.backgroundColor = "#181818";
    rightClass[0].style.backgroundColor = "#181818";
    middleClass[0].style.backgroundColor = "#181818";
    for(var i = 0; i < inputFields.length; i++){
        inputFields[i].style.backgroundColor = "#000";
    }
    for(var i = 0; i < textFields.length; i++){
        textFields[i].style.backgroundColor = "#181818";
    }
    for(var i = 0; i < solidClass.length; i++){
        solidClass[i].style.borderColor = "#181818";
    }
    for(var i = 0; i < labelFields.length; i++){
        labelFields[i].style.backgroundColor = "#181818";
    }
    chrome.storage.sync.set({"visual": "dark"});
}
function toggleLightMode(){
    bodyID.style.backgroundColor = "#fff";
    leftClass[0].style.backgroundColor = "#fff";
    rightClass[0].style.backgroundColor = "#fff";
    middleClass[0].style.backgroundColor = "#bbb";
    for(var i = 0; i < inputFields.length; i++){
        inputFields[i].style.backgroundColor = "#fff";
    }
    for(var i = 0; i < textFields.length; i++){
        textFields[i].style.backgroundColor = "#fff";
    }
    for(var i = 0; i < solidClass.length; i++){
        solidClass[i].style.borderColor = "#bbb";
    }
    for(var i = 0; i < labelFields.length; i++){
        labelFields[i].style.backgroundColor = "#fff";
    }
    chrome.storage.sync.set({"visual": "light"});
}

function resetAlarmData(){
    chrome.alarms.clearAll();
    chrome.storage.local.set({"alarms": []});
    chrome.storage.local.set({"events": []});

    const eList = document.getElementById("eventList");
    while (eList.childElementCount !== 0){
        eList.removeChild(eList.lastChild);
    }

    const aList = document.getElementById("alarmList");
    while (aList.childElementCount !== 0){
        aList.removeChild(aList.lastChild);
    }
}