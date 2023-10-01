#!/usr/bin/env python
""" ドロップダウンを Selenium で扱う"""

from selenium.webdriver import Chrome, ChromeOptions
# Selectモジュールをインポート
from selenium.webdriver.support.select import Select
from selenium.webdriver.common.by import By


class SeleniumStart:
    """
    Selenium の開始と終了を行う
    """
    def __init__(self):
        options = ChromeOptions()
        # ヘッドレスモードで実行する
        options.headless = True
        options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                             'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36')
        # virtualbox 上の ubuntu でこのスクリプトを実行する場合に chromedevtools につき必要な記述
        options.add_argument("--remote-debugging-port=9222")
        self.driver = Chrome(options=options)
        base_url = 'URL....'
        self.driver.get(base_url)
        print("[driver] Start")

    def close(self):
        self.driver.quit()
        print("[driver] End")


selm = SeleniumStart()
# ドロップダウンを選択(<select>タグを取得する)
element = selm.driver.find_element(By.CSS_SELECTOR, "#seach > form #keys6")
# ドロップダウンタグの要素を指定してSelectクラスのインスタンスを作成
dropdown = Select(element)
# ドロップダンウンの内容を取得する
dropdown_op = dropdown.options
print(f"{len(dropdown_op) = }")
# ドロップダンウンの内容を個別に取得する
for option in dropdown_op:
    # ページに表示されているテキスト
    print(f"{option.text = }")
    # HTML上での <option> タグの value= の値
    print(f"{option.get_attribute('value') = }")
    # HTML の表示
    print(f"{option.get_attribute('outerHTML')}")


selm.close()
