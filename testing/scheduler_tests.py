# tests for scheduler
import time
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.remote import switch_to

# link to the chrome extension in .crx form
extension_path = '/Users/houjiaying/Documents/GitHub/Break-Alert.crx'
chop = webdriver.ChromeOptions()
chop.add_extension(extension_path)

# link to chromedriver(mac version)
path_to_chromedriver = '/Users/houjiaying/Documents/GitHub/Break-Alert/testing/chromedriver'
driver = webdriver.Chrome(path_to_chromedriver, options=chop)

# hardcoded id from chromedriver : gpmlkclebboedbdipgpmmkgnbdjdkgck (this opens the popup but the id is unique to my laptop only)
# id from extension: gpmlkclebboedbdipgpmmkgnbdjdkgck
driver.get('chrome-extension://gpmlkclebboedbdipgpmmkgnbdjdkgck/code/popup.html')

# do nothing for 2 seconds
time.sleep(2) 

# switch to scheduler setting page
switch_to_scheduler = driver.find_element_by_css_selector("div.days div")
switch_to_scheduler.click()

time.sleep(2)

# select the input box to type event name into it
inputEventTitle = driver.find_element_by_id("event")
inputEventTitle.send_keys("event 1")

# input date into eventDate input box
js = "document.getElementById('eventDate').removeAttribute('readonly')" 
driver.execute_script(js)
js2 = "document.getElementById('eventDate').value='2021-06-06T06:06'"
driver.execute_script(js2)


time.sleep(1)

# add event 
addEventButton = driver.find_element_by_id("addEvent")
addEventButton.click()

time.sleep(1)

# click dropdown to show event info
dropdown = driver.find_element_by_xpath('//*[@id="event 1"]/i')
dropdown.click()

time.sleep(1)

# assert event info
timeTd = driver.find_element_by_xpath('//*[@id="event 1"]/table/tr[1]/td[2]')
assert(timeTd.text == "2021-06-06T06:06")
repeatTd = driver.find_element_by_xpath('//*[@id="event 1"]/table/tr[2]/td[2]')
assert(repeatTd.text == "")
reminderTd = driver.find_element_by_xpath('//*[@id="event 1"]/table/tr[3]/td[2]')
assert(reminderTd.text == "")
tabsTd = driver.find_element_by_xpath('//*[@id="event 1"]/table/tr[4]/td[2]')
assert(tabsTd.text == "")

time.sleep(1)

# input new data to event 1
js2 = "document.getElementById('eventDate').value='2021-06-01T06:06'"
driver.execute_script(js2)
js3 = "document.getElementById('Mon').checked = true"
driver.execute_script(js3)
js4 = "document.getElementById('tabsToOpen').value = 'tabToOpen'"
driver.execute_script(js4)
js5 = "document.getElementById('remindTime').value = '15:16'"
driver.execute_script(js5)

time.sleep(1)

# edit event
editEventButton = driver.find_element_by_id("editEvent")
editEventButton.click()

time.sleep(2)

# click dropdown to show event info
dropdown = driver.find_element_by_xpath('//*[@id="event 1"]/i')
dropdown.click()

time.sleep(2)

# assert event info
timeTd = driver.find_element_by_xpath('//*[@id="event 1"]/table/tr[1]/td[2]')
assert(timeTd.text == "2021-06-01T06:06")
repeatTd = driver.find_element_by_xpath('//*[@id="event 1"]/table/tr[2]/td[2]')
assert(repeatTd.text == "Mon")
reminderTd = driver.find_element_by_xpath('//*[@id="event 1"]/table/tr[3]/td[2]')
assert(reminderTd.text == "15:16")
tabsTd = driver.find_element_by_xpath('//*[@id="event 1"]/table/tr[4]/td[2]')
assert(tabsTd.text == "tabToOpen")

time.sleep(1)

# delete event
deleteButton = driver.find_element_by_xpath('//*[@id="event 1"]/button')
deleteButton.click()

time.sleep(1)

# check number of event
numEvents = driver.find_elements_by_css_selector("div.events li")
assert(len(numEvents) == 0)

time.sleep(1)

#clear input box
clearButton = driver.find_element_by_id("clearInputs")
clearButton.click()