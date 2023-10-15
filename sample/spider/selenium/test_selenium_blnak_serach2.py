#!/usr/bin/env python
"""
    " "(スペース)を入力して検索する
    selenium 対策がなされていて quit() が必要になるパターン

"""

from selenium.webdriver import Chrome, ChromeOptions
from selenium.webdriver.common.by import By
from tenacity import retry, stop_after_attempt
from itertools import chain
from lxml import html
from bs4 import BeautifulSoup
import requests
import re


class SeleniumStart:
    """
    Selenium の開始と終了を行う
    """
    def __init__(self, base_url=""):
        options = ChromeOptions()
        # ヘッドレスモードで実行する
        options.headless = True
        options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
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

    # スペースが入力された状態で検索ボタンをクリックする。
    selem.driver.execute_script("arguments[0].click();", button_element)
    link_page = selem.driver.current_url
    print(f"{link_page = }")

    # 一旦終了してから再起動
    selem.close()
    selem = SeleniumStart(link_page)
    selem.driver.implicitly_wait(30)

    # 検索結果の件数を取得
    elements = selem.driver.find_elements(By.XPATH, '//p[@class="ResultSearchNumber resultNum"]/span')
    print(elements[0].get_attribute("textContent"))

finally:
    selem.driver.quit()
