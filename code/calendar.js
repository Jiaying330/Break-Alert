/*
Input: Int: month, day
Output: Bool: true or false
Function: check the input date with the local storage to see if the
input date is in the storage

Error: Currently not function properly, return undefined instead of boolean
*/
function checkEvent(month, day){
  let result;
  chrome.storage.local.get({events: []}, function(result) {
    let eventList = result.events;
    for (let evnt in eventList) {
      let eventDate = eventList[evnt].match(/\d{0,6}\-\d{0,2}\-\d{0,2}/g)[0].split("-");
      let eventMonth = Number(eventDate[1]);
      let eventDay = Number(eventDate[2]);

      if (eventMonth === month && eventDay === day) {
        result = true;
      } else {
        result = false;
      }
    }
  });

  return true;
}

// Date object
const date = new Date();

/*
Input: no input
Output: properly set calendar window
Function: set the variables and add content for the calendar for correct display
*/
const renderCalendar = () => {
  // set date to the first day
  date.setDate(1);

  // define days by getting days class
  const monthDays = document.querySelector(".days");

  // define last date of the current month
  const lastDay = new Date (
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  // define last date of the previous month
  const prevLastDay = new Date (
    date.getFullYear(),
    date.getMonth(),
    0
  ).getDate();

  // define first day of the current month
  const firstDayIndex = date.getDay();

  // define last day of the current month
  const lastDayIndex = new Date (
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDay();

  // define the days for next month
  const nextDays = 7 - lastDayIndex - 1;

  // define months
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  // Add current month to the month header
  document.querySelector(".date h1").innerHTML = months[date.getMonth()];

  // Add current date to the month header
  document.querySelector(".date p").innerHTML = new Date().toDateString();

  // define a string of innerHTML to set days
  let days = "";

  // Add days from previous month to the calendar
  for (let i = firstDayIndex; i > 0; i--) {

    // check if these days are in local storage
    let eventExist = checkEvent(date.getMonth(), prevLastDay - i + 1);

    // if so, set event=True; else, set event=False
    if (eventExist === true) {
      days += `<div class="prev-date" event=True>${prevLastDay - i + 1}</div>`;
    } else {
      days += `<div class="prev-date" event=False>${prevLastDay - i + 1}</div>`;
    }
    
  }
  
  // Add days from the current month to the calendar
  for (let j = 1; j <= lastDay; j++) {

    // check if these days are in local storage
    let eventExist = checkEvent(date.getMonth() + 1, j);

    // check if the day is the current day
    // if so, add class="today"
    if (j === new Date().getDate() && date.getMonth() === new Date().getMonth()) {

      // if day in local storage, set event=True; else, set event=False
      if (eventExist) {
        days += `<div class="today" event=True>${j}</div>`;
      } else {
        days += `<div class="today" event=False>${j}</div>`;
      }
    } else {

      // if day in local storage, set event=True; else, set event=False
      if (eventExist) {
        days += `<div event=True>${j}</div>`;
      } else {
        days += `<div event=False>${j}</div>`;
      }
      
    }
  }

  // Add days from the next month to the calendar
  for (let k = 1; k <= nextDays; k++) {

    // check if these days are in local storage
    let eventExist = checkEvent(date.getMonth() + 2, k);

    // if so, set event=True; else, set event=False
    if (eventExist === true) {
      days += `<div class="next-date" event=True>${k}</div>`;
    } else {
      days += `<div class="next-date" event=False>${k}</div>`;
    }
    
    // Add these elements to the days section in the calendar
    monthDays.innerHTML = days;
  }

  // Add event listener to all the day elements,
  // Display the scheduler window when click on any of the day elements
  let schedule = document.querySelectorAll("div.days > div");
  for (let n = 0; n < schedule.length; n++) {
    schedule[n].addEventListener("click", () => {
      document.querySelector(".scheduler").classList.add("show");
    });
  }

  // Display the hasEvent indicator for the day element when storage
  // contains the date information for the associated day element
  // Error: Seems like perform one innerHTML addition will cause all day elements to have this element,
  // which causes display issue for the rest of the day elements in the calendar
  for (let m = 0; m < schedule.length; m++) {
    let event = schedule[m].getAttribute("event");
    let hasIcon = document.querySelector("div.days > div > i");
    console.log(event);
    console.log(hasIcon);
    if (event == "True") {
      if (!hasIcon) {
        schedule[m].innerHTML += `<i class="fa fa-circle" aria-hidden="true"></i>`;
      }
    } 
    else if (event == "False") {
      if (hasIcon) {
        hasIcon.remove();
      }
    }
  }
};

// Move to previous month calendar
document.querySelector(".prev").addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
});

// Move to next month calendar
document.querySelector(".next").addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
});

// Click to hide the scheduler window
document.querySelector(".scheduler-return").addEventListener("click", () => {
  document.querySelector(".scheduler").classList.remove("show");
});

// Display calendar window
renderCalendar();