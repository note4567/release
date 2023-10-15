#!/usr/bin/env python
"""   クッキー処理  """

from selenium.webdriver import Chrome, ChromeOptions
import json


class SeleniumStart:
    """
    Selenium の開始と終了を行う
    """
    def __init__(self, base_url=""):
        options = ChromeOptions()
        # ヘッドレスモードで実行する
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
selem = SeleniumStart("https://www.yahoo.co.jp/")
print(f"{selem.driver.current_url = }")

try:
    # 全てのクッキーの取得
    for cookie in selem.driver.get_cookies():
        # print(cookie)
        print(json.dumps(cookie, indent=2, ensure_ascii=False))

    # name属性値でクッキーを取得
    print("-" * 15, 'driver.get_cookie("XA")', "-" * 15)
    cookie_XA = selem.driver.get_cookie("XA")
    print(json.dumps(cookie_XA, indent=2, ensure_ascii=False))

    # name属性値でクッキーを削除
    print("-" * 15, 'driver.delete_cookie("XA")', "-" * 15)
    selem.driver.delete_cookie("XA")
    print(f'{selem.driver.get_cookie("XA") = }')
    print()
    # 全てのクッキーの削除
    print("-" * 15, 'driver.delete_cookie()', "-" * 15)
    selem.driver.delete_all_cookies()
    print(f'{selem.driver.get_cookies() = }')

    # クッキーの追加
    print("-" * 15, 'driver.add_cookie()', "-" * 15)
    selem.driver.add_cookie({"name": "new_cookie", "value": "Test!"})
    print(f'{selem.driver.get_cookies() = }')

except Exception as e:
    print("[ERROR]", e)

finally:
    print("end")
    selem.driver.quit()

