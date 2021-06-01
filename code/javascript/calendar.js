// /*
// Input: Int: currMonth, currDay
// Output: Bool: true or false
// Function: check the input date with the local storage to see if the
// input date is in the storage
// */
function checkEvent(currYear, currMonth, currDay){

  return new Promise((success, failure) => {

    chrome.storage.local.get({events: []}, function (result) {
      let eventList = result.events;
      let hasEvent = false;

      for (let eventIndex in eventList) {
        let event = eventList[eventIndex].match(/\d{0,6}\-\d{0,2}\-\d{0,2}/g)[0].split("-");
        let eventYear = Number(event[0]);
        let eventMonth = Number(event[1]);
        let eventDay = Number(event[2]);

        
        if (eventMonth === currMonth && eventDay === currDay && eventYear === currYear) {
          hasEvent = true;
          break;
        }

        
        var currDate = new Date()
        currDate.setFullYear(currYear, currMonth-1, currDay); 
        var weekday = currDate.getDay();
        var currEvent = JSON.parse(eventList[eventIndex]);
        var eventDate = new Date(currEvent.time);
        
        // check for repeating event
        for (var repeatIndex = 0; repeatIndex < currEvent.repeat.length; repeatIndex++) {
          if (currDate > eventDate && (weekday == currEvent.repeat[repeatIndex])) {
            hasEvent = true;
            break;
          }
        }
      }

      if (hasEvent === true) {
        success(true);
      } else {
        failure(false);
      }

    });
  })
}
  
// Date object
const date = new Date();

// Date object for the most recent clicked day element
var currDateObj = new Date();

/*
Input: no input
Output: properly set calendar window
Function: set the variables and add content for the calendar for correct display
*/
async function renderCalendar () {
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
  document.querySelector(".date p").innerHTML = date.getFullYear();
  
  // define a string of innerHTML to set days
  let days = "";
  
  // Add days from previous month to the calendar
  for (let i = firstDayIndex; i > 0; i--) {
    let eventExist;
    try {
      eventExist = await checkEvent (date.getFullYear(), date.getMonth(), prevLastDay - i + 1);
    } catch (status) {}

    if (eventExist === true) {
      days += `<div class="prev-date" hasEvent=True>${prevLastDay - i + 1}</div>`;
    } else {
      days += `<div class="prev-date" hasEvent=False>${prevLastDay - i + 1}</div>`;
    }
      
  }
    
  // Add days from the current month to the calendar
  for (let j = 1; j <= lastDay; j++) {
    let eventExist;
    try {
      eventExist = await checkEvent(date.getFullYear(), date.getMonth() + 1, j);
    } catch (status) {}
  
    // check if the day is the current day
    // if so, add class="today"
    if (j === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()) {

      if (eventExist === true) {
        days += `<div class="today" hasEvent=True>${j}</div>`;
      } else {
        days += `<div class="today" hasEvent=False>${j}</div>`;
      }
    } else {
      if (eventExist === true) {
        days += `<div hasEvent=True>${j}</div>`;
      } else {
        days += `<div hasEvent=False>${j}</div>`;
      }        
    }
  }
  
  // Add days from the next month to the calendar
  for (let k = 1; k <= nextDays; k++) {
    let eventExist;
    try {
      eventExist = await checkEvent(date.getFullYear(), date.getMonth() + 2, k);
    } catch (status) {}

    if (eventExist === true) {
      days += `<div class="next-date" hasEvent=True>${k}</div>`;
    } else {
      days += `<div class="next-date" hasEvent=False>${k}</div>`;
    }

  }

  // Add these elements to the days section in the calendar
  monthDays.innerHTML = days;

  // Add event listener to all the day elements,
  // Display the proper calendar event page window when click on any of the day elements
  let event_page = document.querySelectorAll("div.days > div");
  for (let n = 0; n < event_page.length; n++) {
    event_page[n].addEventListener("click", () => {

      // get the date info for the clicked day element
      var inputDate = new Date(date);
      var inputDay = event_page[n].innerHTML.split('<')[0];

      if (event_page[n].className == "next-date") {
        var inputMonth = date.getMonth() == 11 ? 0 : date.getMonth() + 1;
        var inputYear = date.getMonth() == 11 ? date.getFullYear() + 1 : date.getFullYear();
        inputDate.setMonth(inputMonth);
        inputDate.setFullYear(inputYear);
      } else if (event_page[n].className == "prev-date") {
        var inputMonth = date.getMonth() == 0 ? 11 : date.getMonth() - 1;
        var inputYear = date.getMonth() == 0 ? date.getFullYear() - 1 : date.getFullYear();
        inputDate.setMonth(inputMonth);
        inputDate.setFullYear(inputYear);
      }
      inputDate.setDate(inputDay);
      inputDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());

      // set the date info for the most recent day element clicked
      currDateObj = inputDate;

      // range checking to make sure inputDate is a valid number
      // set the current date info for event page header and scheduler input
      if (!isNaN(inputDate)) {
        document.getElementById("eventPage-header").innerText = inputDate.toISOString().slice(0, 10);
        document.getElementById("eventDate").value = inputDate.toISOString().slice(0, 16);
      }

      // get the list of event titles that belongs to the current date element
      chrome.storage.local.get({events: []}, function (result) {
        let eventList = result.events;
        let eventText = "";

        for (let eventIndex in eventList) {
          let eventDate = eventList[eventIndex].match(/\d{0,6}\-\d{0,2}\-\d{0,2}/g)[0].split("-");
          let currDate = inputDate.toISOString().match(/\d{0,6}\-\d{0,2}\-\d{0,2}/g)[0].split("-");
          
          if (JSON.stringify(eventDate) === JSON.stringify(currDate)) {
            let textInfo = eventList[eventIndex].match(/\"text\"\:\"(.*?)\"/g)[0].slice(8, -1);
            eventText += `<li>${textInfo}</li>`;
          }
        }
        if (eventText === "") {
          document.querySelector(".eventPage-list").innerHTML = "";
        } else {
          document.querySelector(".eventPage-list").innerHTML = eventText;
        }
      });

      document.querySelector(".calendar-eventPage").classList.add("show");
    });
  }
  
  // Display the hasEvent indicator for the day element when
  // hasEvent = True for this day element
  for (let m = 0; m < event_page.length; m++) {
    let event = event_page[m].getAttribute("hasEvent");

    if (event === "True") {
      event_page[m].innerHTML += `<i class="fa fa-circle" aria-hidden="true"></i>`;
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

// Click to hide the calendar event page window
document.querySelector(".calendar-eventPage-return").addEventListener("click", () => {
  document.querySelector(".calendar-eventPage").classList.remove("show");
  
  // clear all previous inputs
  var buttonClearInputs = document.getElementById("clearInputs");
  if (buttonClearInputs != null){
    buttonClearInputs.click();
  }

  renderCalendar();
});

// Click to hide the scheduler window
document.querySelector(".scheduler-return").addEventListener("click", () => {
  document.querySelector(".scheduler").classList.remove("show");

  // reset the list of event in the event page
  chrome.storage.local.get({events: []}, function (result) {
    let eventList = result.events;
    let eventText = "";

    for (let eventIndex in eventList) {
      let eventDate = eventList[eventIndex].match(/\d{0,6}\-\d{0,2}\-\d{0,2}/g)[0].split("-");
      let currDate = currDateObj.toISOString().match(/\d{0,6}\-\d{0,2}\-\d{0,2}/g)[0].split("-");

      if (JSON.stringify(eventDate) === JSON.stringify(currDate)) {
        let textInfo = eventList[eventIndex].match(/\"text\"\:\"(.*?)\"/g)[0].slice(8, -1);
        eventText += `<li>${textInfo}</li>`;
      }
    }

    if (eventText === "") {
      document.querySelector(".eventPage-list").innerHTML = "";
    } else {
      document.querySelector(".eventPage-list").innerHTML = eventText;
    }
  });
  
  // clear all previous inputs
  var buttonClearInputs = document.getElementById("clearInputs");
  if (buttonClearInputs != null){
    buttonClearInputs.click();
  }

  renderCalendar();
});
  
// Click to show the scheduler window
document.querySelector(".calendar-eventPage-to-scheduler").addEventListener("click", () => {
  document.querySelector(".scheduler").classList.add("show");
});
  
// Display calendar window
renderCalendar();