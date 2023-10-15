#!/usr/bin/env python
"""
    要素内のテキストを取得する
    text
    get_attribute("textContent")
"""

from selenium.webdriver import Chrome, ChromeOptions
from selenium.webdriver.common.by import By

options = ChromeOptions()
# ヘッドレスモードで実行する
options.headless = True
options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                     'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36')
# virtualbox 上の ubuntu でこのスクリプトを実行する場合に chromedevtools につき必要な記述
options.add_argument("--remote-debugging-port=9222")
driver = Chrome(options=options)
url = "--------------- URL ---------------"
driver.get(url)
print("[driver] Start")

elements_p = driver.find_elements(By.XPATH, '//p[@class="ResultSearchNumber resultNum"]')
elements_span = driver.find_elements(By.XPATH, '//p[@class="ResultSearchNumber resultNum"]/span')
try:
    print(f'{elements_p[0].text = }')
    print(f'{elements_span[0].text = }')
    print(f'{elements_p[0].get_attribute("textContent") = }')
    print(f'{elements_span[0].get_attribute("textContent")  = }')
except Exception as e:
    print("[Error] ", e)
finally:
    driver.quit()
