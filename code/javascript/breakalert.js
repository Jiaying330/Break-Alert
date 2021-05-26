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
//
// workPeriod : time (in minutes) of how long to have the user be productive
// breakPeriod : time (in minutes) of how long to have the user take a break for
function enableBreakAlert(workPeriod, breakPeriod){
  alert("break alert enabled!");
}