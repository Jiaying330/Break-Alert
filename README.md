# Break-Alert
Chrome browser extension to remind user when to take breaks and improve overall productivity.

##  Installation
To install (2 methods):
- From Chrome Browser Store: https://chrome.google.com/webstore/detail/break-alert/bilocpkncpeojgehfelfaecabikkdolb/ (note this may be not the most recent version due to extension review process)
- Manually: 
  1. Clone this repo
  2. Open the puzzle piece icon in top right corner of browser and click `manage extensions`
  3. Enable `Developer Mode` in the top right corner of the page
  4. Select `load unpacked` and select the Break-Alert/ cloned repo
  5. Open the puzzle piece icon in top right corner once again and pin the `Break Alert` extension to the extension area (if not already pinned)

---

##  Multi-tab
### Implemented features:
- open multiple links on one button press
- basic `multi-tab UI` framework for the extension

### Usage:
1. Click `Add Link` to add a link on the page for user inputs.
2. Enter a URL in the textbar, then, click `Open Link(s)` to open the given URL on a new tab (If there are multiple URLs, then, all of them will be open).
3. To delete a link, click on the `Delete` button next to the link.

### Issues:
  - Framework not functional in extension

---

##  Calendar
### Implemented features:
- Create a clean and simple `calendar UI`
- Integrate `scheduler UI` using stack layer approach
- Display symbol for the dates with assgined schedules

### Usage:
1. Click `<` or `>` to naviagte different months.
2. Click `days` in `calendar UI` to display the `scheduler UI`.
3. Click `X` in `scheduler UI` (at the top-right corner) to return to `calendar UI`.

### Issues:
  - Event symbols are displayed incorrectly

---

## Todo List
### Implemented features:
- Add and delete tasks to list
- Ability to mark task as completed (with strikethrough)

---

##  Multi-tab
### Implemented features:
- User can edit websites they don't want to see
- Block websites that user input to website blocker
- Popup to remind user this is a blocked website

### Usage:
- Enable
1. Insert links (1 link each line) into textbox. Example: "facebook.com"
2. Click "Save" button to save the links for blocking
3. Click "Enable" check box to enable the website blocker
- Disable
1. If "Enable" check box was checked, click "Enable" check box to cancel the website blocker
- Delete all links
1. Click "Clear all" button to clear all links
---

### Sources Used:
* Todo/Task List: https://www.w3schools.com/howto/howto_js_todolist.asp.
* Adding "enter" key to trigger a button click: https://www.w3schools.com/howto/howto_js_trigger_button_enter.asp
* Style Guide for CSS/HTML: https://google.github.io/styleguide/htmlcssguide.html
* Style Guide for Javascript: https://google.github.io/styleguide/jsguide.html#file-name
* ChromeDriver for Testing with Selenium: https://chromedriver.chromium.org/getting-started, https://www.selenium.dev/, https://selenium-python.readthedocs.io/getting-started.html, https://www.selenium.dev/selenium/docs/api/py/webdriver_remote/selenium.webdriver.remote.webelement.html
* Setting up Selenium w/ Chrome Extensions specifically: https://www.browserstack.com/guide/test-chrome-extensions-in-selenium, https://www.blazemeter.com/blog/6-easy-steps-testing-your-chrome-extension-selenium
* For learning async/await and promises in JS: https://www.youtube.com/watch?v=V_Kr9OSfDeU, https://www.youtube.com/watch?v=DHvZLI7Db8E
