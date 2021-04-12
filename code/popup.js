
/**
 * Tab controller
 * Removes active class from all other tabs on click
 * Add active class to clicked icon
 */
 const tabs = document.querySelectorAll('[data-tab-target]');
 const tabContents = document.querySelectorAll('[data-tab-content');
 tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = document.querySelector(tab.dataset.tabTarget);
    tabContents.forEach(tabContents => {
      tabContents.classList.remove('active');
    })
    target.classList.add('active');
  })
})


/**
 * Setting something inside local storage 
 * For testing
 * Uncomment on first run
 * Load unpacked
 * Comment out this section
 * Reload unpacked 
 */
// var myArray = [{'name': "Test 1"}, {'name': "Test 2"}, {'name': "Test 3"}, {'name': "Test 4"}, {'name': "Test 5"}]
// chrome.storage.sync.set({'myTabs': myArray}, function(){
//   console.log('Value set to ' + myArray);
// });

/**
 * Create tab code for tab controller
 * Needs more styling and content
 */
const myList = document.getElementById("allTabs");
function createTab(name){
  var myTab = document.createElement("div");
  myTab.innerHTML = name;
  return myTab;
}

/**
 * Get from local storage 
 * Ran on start of chrome launch
 * Fills out left side content
 */
 chrome.storage.sync.get(['myTabs'], function(items){
  if(typeof items.myTabs === 'undefined'){

  } else {
    console.log(items.myTabs);
    var myArray = JSON.parse(JSON.stringify(items.myTabs)); // important
    myArray.map((item) => {
      myList.append(createTab(item.name));
    });  
  }
})
