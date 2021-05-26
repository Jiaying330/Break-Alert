// add listeners for enabling and disabling break alert
document.addEventListener('DOMContentLoaded', function () {
	var buttonEnable = document.getElementById("enableBreakAlert");
	var buttonDisable = document.getElementById("disableBreakAlert");
  if (buttonEnable != null)
	  buttonEnable.addEventListener("click", enableBreakAlert);
  if (buttonDisable != null)
	  buttonDisable.addEventListener("click", disableBreakAlert); 
});


// disable break alert (clear saved data in chrome storage)
function disableBreakAlert(){
  alert("break alert disabled!");
}

// enable break alert (save user inputted data into chrome storage
// and create an alarm)
function enableBreakAlert(){
  var productivePeriod = document.getElementById("productiveDuration").value;
  var breakPeriod = document.getElementById("breakDuration").value;

  // check for empty input boxes before creating the alarm and storing it
  if (productivePeriod == "" || breakPeriod == ""){
    alert("Error: One or more above values are empty!");
  } 
  
  else {
    // call helper function to create/overwrite a new break alert alarm and start
    // in productive mode
    replaceBreakAlarm(productivePeriod);

    // add the productivePeriod and breakPeriod to chrome storage
    chrome.storage.sync.get("breakAlertData", function(result) {
      var copyBreakAlertData = result.breakAlertData;

      var userInputs = JSON.stringify({'productive' : productivePeriod, 'break' : breakPeriod});
      copyBreakAlertData = userInputs;

      chrome.storage.sync.set({"breakAlertData": copyBreakAlertData}, function(){
        alert("after setting breakAlertData: " + copyBreakAlertData);
      });  // end set 
    });  // end get

  }  // end else
}


// delete the current break alert alarm (if it exists) and create a new
// alarm with a different duration (switch between productive period and
// break periods)
//
// period : productive or break period to set the new alarm at (string)
function replaceBreakAlarm(period){
  // delete current break alert alarm if it exists
  deleteBreakAlarm();

  // create the new break alert alarm (need to convert period from string to int)
  chrome.alarms.create("BreakAlert", {delayInMinutes : parseInt(period)})
}


// delete the current break alert alarm (if it exists)
function deleteBreakAlarm(){
  // check if there is a break alert alarm already in the background and clear it if it does exist
  chrome.alarms.get("BreakAlert", function(alarm) {
    if (typeof alarm != "undefined"){
      chrome.alarms.clear("BreakAlert");
      alert("prev alarm cleared");
    }
  });
}