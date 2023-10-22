#!/usr/bin/env python
"""   位置情報の入力が必要な場合  """

from selenium.webdriver import Chrome, ChromeOptions
from selenium.webdriver.common.by import By


class SeleniumStart:
    """
    Selenium の開始と終了を行う
    """
    def __init__(self, base_url=""):
        options = ChromeOptions()
        # ヘッドレスモードで実行する
        # options.headless = True
        options.add_argument('--headless=new')
        # navigator.webdriver=false とする設定
        # (Web ブラウザが自動で操作されているかどうかを示す読み取り専用のプロパティ)
        options.add_argument('--disable-blink-features=AutomationControlled')
        # Chromeの保護機能を無効
        options.add_argument('--no-sandbox')
        # 初期のウィンドウサイズを指定
        options.add_argument('--window-size=1920,1080')
        options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                             'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36')
        # virtualbox 上の ubuntu でこのスクリプトを実行する場合に chromedevtools につき必要な記述
        options.add_argument("--remote-debugging-port=9222")
        options.add_argument("--disable-application-cache")
        options.add_argument("disk-cache-size=0")
        self.driver = Chrome(options=options)
        self.base_url = base_url
        self.driver.get(self.base_url)
        print("[driver] Start")

    def close(self):
        self.driver.quit()
        print("[driver] End")


# selenium の起動処理
selem = SeleniumStart("-------------- URL ---------------")
print(f"{selem.driver.current_url = }")

try:
    # 位置情報の設定を許可（許可をしないと位置情報の設定ができない）
    selem.driver.execute_cdp_cmd(
        "Browser.grantPermissions",
        {
            # ここにアクセスしたい URL を記入する
            "origin": "-------------- URL --------------",
            "permissions": ["geolocation"]
        },
    )

    # 緯度、経度、緯度・経度の誤差(単位：m)を設定する
    selem.driver.execute_cdp_cmd(
        "Emulation.setGeolocationOverride",
        {
            "latitude": 35.689487,
            "longitude": 139.691706,
            "accuracy": 100,
        },
    )
    # navigator.webdriver のプロパティが false である事の確認
    print(selem.driver.execute_script('return navigator.webdriver'))
    # アカマイセキュリティ対策
    selem.driver.delete_cookie("ak_bmsc")
    # h1 テキストの表示
    print(selem.driver.find_element(By.XPATH, '//h1[@class="c-hdg--lv1"]').text)

finally:
    selem.driver.quit()
