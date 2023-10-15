#!/usr/bin/env python
"""   クローラー対策がある場合
      Akamai Bot Manager  """

from selenium.webdriver import Chrome, ChromeOptions
from selenium.webdriver.common.by import By
import json


class SeleniumStart:
    """
    Selenium の開始と終了を行う
    """
    def __init__(self, base_url=""):
        options = ChromeOptions()
        # ヘッドレスモードで実行する
        # options.headless = True
        options.add_argument('--headless=new')
        options.add_argument('user-agent=Mozilla/4.0 (Windows NT 10.0; Win64; x64) '
                             'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36')
        # virtualbox 上の ubuntu でこのスクリプトを実行する場合に chromedevtools につき必要な記述
        options.add_argument("--remote-debugging-port=9222")
        self.driver = Chrome(options=options)
        self.base_url = base_url
        self.driver.get(self.base_url)
        print("[driver] Start")

    def close(self):
        self.driver.quit()
        print("[driver] End")


# selenium の起動処理
selem = SeleniumStart("--------------- URL ---------------")
print(f"{selem.driver.current_url = }")

try:
    # input 要素を取得
    input_element = selem.driver.find_element(By.XPATH, '//input[@id="SearchField"]')

    # input 要素に " "(スペース)を入力
    input_element.send_keys(" ")

    # button 要素を取得(検索ボタン)
    button_element = selem.driver.find_element(By.XPATH, '//form[@id="SearchForm"]//button[@type="submit"]')

    # 全てのクッキーを表示
    for cookie in selem.driver.get_cookies():
        print(json.dumps(cookie, indent=2, ensure_ascii=False))

    # name属性値が ak_bmsc のクッキーを削除
    print("-" * 15, 'driver.delete_cookie("ak_bmsc")', "-" * 15)
    selem.driver.delete_cookie("ak_bmsc")
    cookie_ak = selem.driver.get_cookie("ak_bmsc")
    print(json.dumps(cookie_ak, indent=2, ensure_ascii=False))

    # スペースが入力された状態で検索ボタンをクリックする。
    selem.driver.execute_script("arguments[0].click();", button_element)
    link_page = selem.driver.current_url
    print(f"{link_page = }")

    # 検索結果の件数を取得
    print("-" * 15, '検索結果の件数', "-" * 15)
    elements = selem.driver.find_elements(By.XPATH, '//p[@class="ResultSearchNumber resultNum"]/span')
    print(elements[0].get_attribute("textContent"))

finally:
    print("end")
    selem.driver.quit()

