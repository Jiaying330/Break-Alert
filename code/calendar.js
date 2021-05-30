/**
 * CSE183 Assignment 4 - Advanced
 */
 class Picker {
  /**
   * Create a date picker
   * @param {string} containerId id of a node the Picker will be a child of
   */  
  constructor(containerId) {
    this.containerId = containerId;
    let d = new Date();
    this.d = d;
    let day = d.getDay();
    this.day = day;
    let day2 = d.getDate();
    this.day2 = day2;
    let month = d.getMonth();
    this.month = month;
    console.log(month);
    let year = d.getFullYear();
    this.year = year;
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
    const numOfDays = [31, this.getFebruaryDays(this.year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    this.monthNames = monthNames;
    this.numOfDays = numOfDays;
    containerId.getElementById("month").innerText = monthNames[month];
    containerId.getElementById("year").innerText = year;
    console.log(day2);
    let startDate = 7 - (day2 - day - 1) % 7;
    this.startDate = startDate;
    let endDate = startDate + numOfDays[month];
    this.endDate = endDate;
    this.setUpCalendar(startDate, endDate);    
  }

  getFebruaryDays(year){
    if(year % 4 == 0){
      return 28;
    } else if(year % 25 != 0){
      return 29;
    } else if (year % 16 != 0){
      return 28;
    }
    return 29;
  }

  setUpCalendar(start, end){
    this.startDate = start;
    this.endDate = end;
    console.log("start date " + this.startDate);
    console.log(this.endDate);
    for(let a  = 0; a < start; a++){
      this.containerId.getElementsByTagName('td')[a].innerText = '';
      this.containerId.getElementsByTagName('td')[a].style.background = "none";
    }
    for(let a  = start; a < end; a++){
      this.containerId.getElementsByTagName('td')[a].innerText = a - start + 1;
      if(a - start + 1 == this.d.getDate() && this.year == this.d.getFullYear() && this.month == this.d.getMonth()){
        this.containerId.getElementsByTagName('td')[a].style.background = "red";
      }else{
        this.containerId.getElementsByTagName('td')[a].style.background = "none";
      }
    }
    for(let a = end; a < 42; a++){
      this.containerId.getElementsByTagName('td')[a].innerText = '';
      this.containerId.getElementsByTagName('td')[a].style.background = "none";
    }
  }
  
  nextMonth(){
    this.month = this.month + 1;
    if(this.month == 12){
      this.month = 0;
      this.year++;
    }
    this.containerId.getElementById("month").innerText = this.monthNames[this.month];
    this.containerId.getElementById("year").innerText = this.year;
    this.setUpCalendar(this.endDate % 7, (this.endDate % 7) + this.numOfDays[this.month]);  
  }

  prevMonth(){
    this.month = this.month - 1;
    if(this.month == -1){
      this.month = 11;
      this.year--;
    }
    this.containerId.getElementById("month").innerText = this.monthNames[this.month];
    this.containerId.getElementById("year").innerText = this.year;
    let newEnd = this.startDate - 1;
    if(newEnd == -1){
      newEnd = 6;
    }
    console.log("newEnd " + newEnd);
    if(this.numOfDays[this.month] == 30 && newEnd <= 0){
      newEnd = newEnd + 35 + 1;
    }else if(this.numOfDays[this.month] == 31 && newEnd <= 1){
      newEnd = newEnd + 35 + 1;
    }else if(this.numOfDays[this.month] == 28 && newEnd == 6){
      newEnd = newEnd + 21 + 1;
    } else {
      newEnd = newEnd + 28 + 1;
    }
    console.log(newEnd);
    this.setUpCalendar(newEnd - this.numOfDays[this.month], newEnd);  
  }
}
