// add listeners for enabling and disabling break alert
document.addEventListener('DOMContentLoaded', function () {
	var buttonEnable = document.getElementById("enableBreakAlert");
	var buttonDisable = document.getElementById("disableBreakAlert");
  var breakAlertInput = document.getElementById("breakDuration");

  if (buttonDisable != null)
	  buttonDisable.addEventListener("click", disableBreakAlert); 

  if (breakAlertInput != null && buttonEnable != null){
	  buttonEnable.addEventListener("click", enableBreakAlert);

    // Allow for user to hit "enter" to add the breakalert (instead of having to click)
    breakAlertInput.addEventListener("keyup", function(event) {
      // Number 13 is the "Enter" key on the keyboard
      // keyCode element is deprecated but it still works
      if (event.keyCode === 13) {
        // Trigger the button element with a click
        buttonEnable.click();
      }
    });
  }
  
});

// disable break alert (clear saved data in chrome storage)
function disableBreakAlert(){
  deleteBreakAlarm();
  alert("Break alert disabled!");
}

// enable break alert (save user inputted data into chrome storage
// and create an alarm)
async function enableBreakAlert(){
  var productivePeriod = document.getElementById("productiveDuration").value;
  var breakPeriod = document.getElementById("breakDuration").value;
  var isActive;

  // add a try and catch block to catch errors of the helper function
  // (otherwise Chrome throws an error); it seems that when try{} 
  // executes, isActive is true and vice versa for catch{}
  try{
    // force all execution to wait for isActiveBreakAlert() to return
    isActive = await isActiveBreakAlert();
  }
  catch (status) {
    // isActive (status) is false
  }
  
  // check for empty input boxes before creating the alarm and storing it
  if (productivePeriod == "" || breakPeriod == ""){
    alert("Error: One or more above values are empty!");
  } 
  else if (isActive){
    // already an active break alert, so have user disable it first
    alert("Error: Already an active Break Alert. Please disable it to set a new one");
  }
  else {
    // call helper function to create/overwrite a new break alert alarm and start
    // in productive mode
    createProdBreakAlarm(productivePeriod);

    // add the productivePeriod and breakPeriod to chrome storage
    chrome.storage.sync.get("breakAlertData", function(result) {
      var copyBreakAlertData = result.breakAlertData;

      // start on productive mode (ie. be productive for 'productivePeriod' mins)
      var userInputs = JSON.stringify({'productive' : productivePeriod,
                                       'break' : breakPeriod, 
                                       'mode' : "productive"});

      copyBreakAlertData = userInputs;

      chrome.storage.sync.set({"breakAlertData": copyBreakAlertData}, function(data){
        // alert("after setting breakAlertData: " + copyBreakAlertData);
      });  // end set 
    });  // end get
    
    alert("Break alert enabled!");
  }  // end else

}


// create a new break alert alarm with a different duration
//
// period : productive or break period to set the new alarm at (string)
function createProdBreakAlarm(period){
  chrome.alarms.get("BreakAlert", function(alarm) {
    if (typeof alarm == "undefined"){
      // create the new break alert alarm (need to convert period from string to int)
      chrome.alarms.create("BreakAlert", {delayInMinutes : parseInt(period)});
    }

    // enable website blocking for productive mode
	  const blockedcheckbox = document.getElementById("blockedcheckbox");
    if (blockedcheckbox != null){
      blockedcheckbox.checked = false;
      const enabled = true;
      chrome.storage.local.set({ enabled });
    }
  });
}

// check if there's an existing breakAlert alarm active already and return T/F
//
// NOTE: since this function uses chrome.alarms.get which returns a promise, it runs
//       in the background while other code is executed in the meantime (which means
//       code dependent on this function may run out of order); to avoid this issue, 
//       use `await` in a try catch block
function isActiveBreakAlert(){
  return new Promise((success, failure) => {
    chrome.alarms.get("BreakAlert", function(alarm) {
      if (typeof alarm != "undefined"){
        // "return" true
        success(true);
      }
      else {
        // "return" false
        failure(false);
      }
    });
  })
}

// delete the current break alert alarm (if it exists)
function deleteBreakAlarm(){
  // check if there is a break alert alarm already in the background and clear it if it does exist
  chrome.alarms.get("BreakAlert", function(alarm) {
    if (typeof alarm != "undefined"){
      chrome.alarms.clear("BreakAlert");
    }
  });

  // delete the break alert from chrome storage as well
  chrome.storage.sync.set({"breakAlertData": []});
}