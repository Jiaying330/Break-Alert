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
        if(result.visual == "dark"){
            toggleMode();
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

/**
 * resetMultiTabData
 * Sets the chrome storage "myTabs" to an empty array
 * Pops off every item that is a child of the tab list
 */
function resetMultiTabData(){
    chrome.storage.sync.set({"myTabs": []});
    const myList = document.getElementById("allTabs");
    while (myList.childElementCount !== 0){
        myList.removeChild(myList.lastChild);
    }
}

/**
 * resetTodoData
 * Sets the chrome storage "tasks" to an empty array
 * Pops off every item that is a child of the task list
 */
function resetTodoData(){
    chrome.storage.sync.set({"tasks": []});
    const myTodoList = document.getElementById("todoList");
    while (myTodoList.childElementCount !== 0){
        myTodoList.removeChild(myTodoList.lastChild);
    }
}
const visualSettings = document.getElementById('visualSettings');
const settings = document.getElementById('settings');
/**
 * openVisualSettings
 * Opens up the Dark/Light mode option page
 */
function openVisualSettings(){
    settings.classList.remove('active');
    visualSettings.classList.add('active');
}

function toggleMode(){
    document.documentElement.classList.toggle('darkMode');
    document.querySelectorAll('.inverted').forEach((result) => {
        result.classList.toggle('invert');
    })
}

function toggleDarkMode(){
    chrome.storage.sync.get(["visual"], function(result) {
        if(result.visual == "light"){
            toggleMode();
        }
    });
    chrome.storage.sync.set({"visual": "dark"});
}
function toggleLightMode(){
    chrome.storage.sync.get(["visual"], function(result) {
        if(result.visual == "dark"){
            toggleMode();
        }
    });
    chrome.storage.sync.set({"visual": "light"});
}

/**
 * resetAlarmData
 * Sets the chrome storage "alarms" and "events" to an empty array
 * Pops off every item that is a child of the event and alarm list
 */
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