# Break-Alert
Chrome browser extension that has the user insert a time interval of a break alert


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


Sources Used:
* Todo/Task List: https://www.w3schools.com/howto/howto_js_todolist.asp.
* Style Guide for CSS/HTML: https://google.github.io/styleguide/htmlcssguide.html
* Style Guide for Javascript: https://google.github.io/styleguide/jsguide.html#file-name
* ChromeDriver for Testing with Selenium: https://chromedriver.chromium.org/getting-started, https://www.selenium.dev/, https://selenium-python.readthedocs.io/getting-started.html, https://www.selenium.dev/selenium/docs/api/py/webdriver_remote/selenium.webdriver.remote.webelement.html
* Setting up Selenium w/ Chrome Extensions specifically: https://www.browserstack.com/guide/test-chrome-extensions-in-selenium, https://www.blazemeter.com/blog/6-easy-steps-testing-your-chrome-extension-selenium
* For learning async/await and promises in JS: https://www.youtube.com/watch?v=V_Kr9OSfDeU, https://www.youtube.com/watch?v=DHvZLI7Db8E