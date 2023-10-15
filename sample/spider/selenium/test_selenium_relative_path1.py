#!/usr/bin/env python
"""   相対パス  """

from selenium.webdriver import Chrome, ChromeOptions
from selenium.webdriver.common.by import By

# Chrome をヘッドレスモードで実行する
options = ChromeOptions()
options.headless = True
options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                     'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36')
# virtualbox 上の ubuntu でこのスクリプトを実行する場合に chromedevtools につき必要な記述
options.add_argument("--remote-debugging-port=9222")
options.add_argument('--headless=new')
user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) ' \
             'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36'
options.add_argument(f'user-agent=user_agent')
driver = Chrome(options=options)

try:
    url = "--------------- URL ---------------"
    driver.get(url)
    print(f"{driver.current_url = }")

    # div 要素を取得
    div_element = driver.find_element(By.XPATH, '//div[@class="ResultBox__table"]')

    # 取得した div要素から相対パスで h4を取得
    h4_element = driver.find_element(By.XPATH, './/h4')
    print(h4_element.text)

finally:
    driver.quit()
