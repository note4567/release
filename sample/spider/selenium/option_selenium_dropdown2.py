#!/usr/bin/env python
""" fetch_page() の中で writerow() を使う"""

import csv
from selenium.webdriver import Chrome, ChromeOptions
# Selectモジュールをインポート
from selenium.webdriver.support.select import Select
from selenium.webdriver.common.by import By
from urllib.parse import urljoin
import time


class SeleniumStart:
    """
    Selenium の開始と終了を行う
    """
    def __init__(self, url):
        try:
            self.base_url = 'URL....'
            options = ChromeOptions()
            # ヘッドレスモードで実行する
            options.headless = True
            options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                                 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36')
            # virtualbox 上の ubuntu でこのスクリプトを実行する場合に chromedevtools につき必要な記述
            options.add_argument("--remote-debugging-port=9222")
            self.driver = Chrome(options=options)
            self.driver.get(url)
            print("[driver] Start")
        except Exception as e:
            print("{Error}", e)
            self.driver.quit()

    def close(self):
        self.driver.quit()
        print("[driver] End")


counter = 1


def get_urls():

    # ### [ドロップダウンのテキストをリストとして取得する] ###
    top_url = "URL....."
    selm = SeleniumStart(top_url)
    try:
        # ドロップダウンを選択(<select>タグを取得する)
        element = selm.driver.find_element(By.CSS_SELECTOR, "#seach > form #keys6")
        # セレクトタグの要素を指定してSelectクラスのインスタンスを作成
        dropdown = Select(element)
        # ドロップダンウンの内容を取得する
        dropdown_op = dropdown.options
        # ドロップダウンのテキスト内容をリストに書き出す
        drop_list = [option.text for option in dropdown_op if option.text and option.text != "戒告"]
        drop_list.reverse()
        print(f"{drop_list = }")
        selm.close()

        # ### [ドロップダウンのテキストをキーにして検索する] ###
        for drop_text in drop_list:
            selm = SeleniumStart(top_url)
            element = selm.driver.find_element(By.CSS_SELECTOR, "#seach > form #keys6")
            # セレクトタグの要素を指定してSelectクラスのインスタンスを作成
            dropdown = Select(element)
            print(drop_text)
            # ドロップダウンのテキスト(ページに表示されているテキスト)名からドロップダウンを選択する
            # [例] dropdown.select_by_visible_text('業務停止')
            dropdown.select_by_visible_text(drop_text)
            # 検索ボタンをクリック
            selm.driver.find_element(By.CSS_SELECTOR, "#seach > form #submit").click()
            url = selm.driver.current_url
            selm.close()
            print(f"{url}", "-"*45)
            for _ in range(1000):
                yield url
                try:
                    selm = SeleniumStart(url)
                    time.sleep(1)
                    # 次のページがある場合の処理
                    if elements := selm.driver.find_elements(By.CSS_SELECTOR, "#main > div > a"):
                        url = urljoin(selm.base_url, elements[0].get_attribute("href"))
                        print("nextURL", url)
                    else:
                        print("[END]", "-"*45)
                        break
                finally:
                    selm.close()

    except Exception as e:
        print(f"[Error] {e}")
    finally:
        print("Driver Quit------")
        selm.close()


def fetch_page(url):
    print("[Fetch]", url)
    global counter
    selm = SeleniumStart(url)
    try:
        elements = selm.driver.find_elements(By.XPATH, '//div[@id="main"]//div//table')
        for element in elements:
            for key in data:
                if key == "弁護士氏名":
                    path = './/span[contains(text(),"弁護士氏名：")]/following-sibling::strong'
                else:
                    path = f'.//th[contains(text(),"{key}")]/following-sibling::td'
                data[key] = ele[0].text if (ele := element.find_elements(By.XPATH, path)) else ""
            print(f"[{counter}]")
            p = {print(k, ":", v) for k, v in data.items()}
            writer.writerow(data.values())
            counter += 1
    finally:
        selm.close()


with open('./bengoshi.csv', 'w') as f:
    writer = csv.writer(f)
    data = {"弁護士氏名": "", "登録番号": "", "所属弁護士会": "", "法律事務所名": "", "懲戒種別": "",
            "自由と正義掲載年度": "", "処分理由の要旨": ""}
    writer.writerow([key for key in data])
    list(map(fetch_page, get_urls()))
