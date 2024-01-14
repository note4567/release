#!/usr/bin/env python
"""   ドライバのバージョンアップを自動化  """

from selenium.webdriver import Chrome, ChromeOptions
# webdriver_managerは、使用するWebブラウザのバージョンに合わせて最新のドライバをダウンロード
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service as ChromiumService
from webdriver_manager.core.os_manager import ChromeType
from selenium.webdriver.common.by import By
import fake_useragent


class SeleniumStart:
    """
    Selenium の開始と終了を行う
    """
    def __init__(self, base_url=""):
        # [ドライバのバージョンアップを自動化]
        # selenium 3
        # service = ChromeService(executable_path=ChromeDriverManager().install())
        # service = ChromeService(ChromeDriverManager().install())
        # selenium 4
        service = ChromiumService(ChromeDriverManager(chrome_type=ChromeType.CHROMIUM).install())

        # [オプション処理]
        options = ChromeOptions()
        # パスの指定が必要な場合
        # options.binary_location = '/usr/bin/chromium-browser'
        # ヘッドレスモードで実行する
        # options.headless = True
        options.add_argument('--headless=new')
        # navigator.webdriver=false とする設定
        options.add_argument('--disable-blink-features=AutomationControlled')
        # SSL認証(この接続ではプライバシーが保護されません)を無効
        options.add_argument('--ignore-certificate-errors')
        options.add_argument('--ignore-ssl-errors=yes')
        # Chromeの保護機能を無効
        options.add_argument('--no-sandbox')
        # 初期のウィンドウサイズを指定
        options.add_argument('--window-size=1920,1080')
        # 画像を表示させる
        options.add_argument('--blink-settings=imagesEnabled=true')
        # ユーザーエージェントの偽装
        fake_ua = fake_useragent.UserAgent()
        print(fake_ua.random)
        options.add_argument(f'user-agent={fake_ua.random}')
        # virtualbox 上の ubuntu でこのスクリプトを実行する場合に chromedevtools につき必要な記述
        options.add_argument("--remote-debugging-port=9222")
        options.add_argument("--disable-application-cache")
        options.add_argument("disk-cache-size=0")
        # 通常の起動
        # self.driver = Chrome(options=options)
        # service オプションを指定して起動
        self.driver = Chrome(options=options, service=service)
        self.base_url = base_url
        self.driver.get(self.base_url)
        print("[driver] Start")

    def close(self):
        self.driver.quit()
        print("[driver] End")


# selenium の起動処理
url = "https://www.google.co.jp"
selem = SeleniumStart(url)
print(f"{selem.driver.current_url = }")

try:
    # キャッシュを残さない
    selem.driver.execute_cdp_cmd("Network.setCacheDisabled", {"cacheDisabled": True})
    print(selem.driver.execute_script('return navigator.webdriver'))
finally:
    print("end")
    selem.driver.quit()

