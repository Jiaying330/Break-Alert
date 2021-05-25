# tests for scheduler

import time
from selenium import webdriver

# link to the chrome extension in .crx form
extension_path = '/Users/houjiaying/Documents/GitHub/Break-Alert.crx'
chop = webdriver.ChromeOptions()
chop.add_extension(extension_path)

# link to chromedriver.exe
path_to_chromedriver = './chromedriver'
driver = webdriver.Chrome(path_to_chromedriver, options=chop)

# hardcoded id from chromedriver : ifofbjinpigefmlmffefmockecioklam (this opens the popup but the id is unique to my laptop only)
# id from extension: ikpmenhphlekealoglgagfcednkdcacp
driver.get('chrome-extension://adelgjinkigmakefjabgnodblgjlgenb/code/popup.html')

# do nothing for 2 seconds
time.sleep(2) 

# select the input box to type data into
inputEventTitle = driver.find_element_by_id("event")
inputEventTitle.send_keys("event 1")
inputEventDate = driver.find_element_by_id("eventDate")
# inputEventDate.sendKey(new Date().toISOString())

time.sleep(1)

# add event 
addEventButton = driver.find_element_by_id("addEvent")
addEventButton.click()

time.sleep(1)


#driver.execute_script("document.getElementsById('eventDate').valueAsDate = new Date();")