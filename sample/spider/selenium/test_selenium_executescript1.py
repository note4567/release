#!/usr/bin/env python
""" SeleniumからJavaScriptを実行する """

from selenium.webdriver import Chrome, ChromeOptions

options = ChromeOptions()
options.headless = True
options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                     'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36')
# virtualbox 上の ubuntu でこのスクリプトを実行する場合に chromedevtools につき必要な記述
options.add_argument("--remote-debugging-port=9222")
driver = Chrome(options=options)

try:
    num1 = 1
    num2 = 2
    total = driver.execute_script("return arguments[0] + arguments[1];", num1, num2)
    print(total)
finally:
    driver.quit()
