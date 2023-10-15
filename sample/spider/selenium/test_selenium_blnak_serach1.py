#!/usr/bin/env python
"""
    " "(スペース)を入力して検索する
"""

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

    # input 要素を取得
    input_element = driver.find_element(By.XPATH, '//input[@id="iptSearchWord"]')
    # input 要素に " "(スペース)を入力
    input_element.send_keys(" ")

    # button 要素を取得(検索ボタン)
    button_element = driver.find_element(By.XPATH, '//button[@id="btnSearchWord"]')
    # スペースが入力された状態で検索ボタンをクリックする。
    driver.execute_script("arguments[0].click();", button_element)
    print(f"{driver.current_url = }")

    # 一覧リンクページを取得
    elements = driver.find_elements(By.XPATH, '//section[@class="shop03"]//tr[position()>=2]//a')
    print(len(elements))
    for i, element in enumerate(elements):
        print(i, element.get_attribute("href"))

finally:
    driver.quit()
