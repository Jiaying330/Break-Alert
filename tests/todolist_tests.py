# tests for todo list

# To run this test on Windows, open Git Bash and run 'pip install selenium'. Then
# simply click this file to run it

import time
from selenium import webdriver

path = './chromedriver.exe'  # Add path to the chrome driver
driver = webdriver.Chrome(path)  # Optional argument, if not specified will search path.


driver.get('http://www.google.com/')

time.sleep(1) # Let the user actually see something!

search_box = driver.find_element_by_name('q')

search_box.send_keys('ChromeDriver')

search_box.submit()

time.sleep(1) # Let the user actually see something!

driver.quit()
