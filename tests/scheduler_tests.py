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
path_to_chromedriver = '/Users/houjiaying/Documents/GitHub/Break-Alert/tests/chromedriver'
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

eventLi = driver.find_element_by_class_name("entireEvent")
eventLi.click()

# time.sleep(1)


#driver.execute_script("document.getElementsById('eventDate').valueAsDate = new Date();")