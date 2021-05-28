# tests for todo list

# To run this test on Windows, open Git Bash and run 'pip install selenium'. Then
# open up a git bash window in the Break-Alert/ folder and run `py tests/todolist_tests.py`

# NOTE: the extension id hardcoded from the ChromeDriver is currently unique to the crx file
# created when the extension is packed together
# 
# this testing file DOES NOT currently use the version from the Chrome Store since it is not
# up to date (due to delay of reviewing our extension updates before accepting it into the store)

import time
from selenium import webdriver

# link to the chrome extension in .crx form
# 
# NOTE: this path may need to be changed to whereever the packed crx file is located on your
# local system
extension_path = '../Break-Alert.crx'
chop = webdriver.ChromeOptions()
chop.add_extension(extension_path)

# link to chromedriver.exe 
# (however, don't need to explicitly use the path since it's defined in my system env variables)
path_to_chromedriver = 'tests/chromedriver.exe'
driver = webdriver.Chrome(path_to_chromedriver, options=chop)

# hardcoded id from chromedriver : helkojdkocknicnipdafippibaecpnbk (this opens the extension but the id is unique to my laptop only)
driver.get('chrome-extension://helkojdkocknicnipdafippibaecpnbk/code/popup.html')

# do nothing for 2 seconds
time.sleep(2) 

# switch to todolist tab
switch_to_todolist_button = driver.find_element_by_name("openTodoListTab")
switch_to_todolist_button.click()

# do nothing for 1 seconds
time.sleep(1)

# select the input box to type data into
inputTask = driver.find_element_by_id("input")
inputTask.send_keys("task 1")

time.sleep(1)

# add task to todo list
submitTaskButton = driver.find_element_by_id("addTaskListener")
submitTaskButton.click()

time.sleep(1)

# add a second and third task
inputTask.send_keys("task 2")
time.sleep(1)
submitTaskButton.click()
time.sleep(1)
inputTask.send_keys("task 3")
time.sleep(1)
submitTaskButton.click()
time.sleep(2)

# refresh the page to test if the tasks saved
driver.refresh()
time.sleep(2)

# navigate back to todolist tab
switch_to_todolist_button = driver.find_element_by_name("openTodoListTab")
switch_to_todolist_button.click()

# assert (check) that the todolist size is 3 
numTasks = driver.find_elements_by_css_selector("div.taskList li")
# print("todolist:")
# print(numTasks)
# print(len(numTasks))
assert(len(numTasks) == 3)

# driver.quit()
