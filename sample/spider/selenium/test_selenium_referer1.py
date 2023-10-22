#!/usr/bin/env python
"""   referer を偽装する  """

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
url = "https://news.yahoo.co.jp/pickup/6478781"
selem = SeleniumStart(url)
print(f"{selem.driver.current_url = }")

try:
    # キャッシュを残さない
    selem.driver.execute_cdp_cmd("Network.setCacheDisabled", {"cacheDisabled": True})
    # navigator.webdriver の値を確認
    print(selem.driver.execute_script('return navigator.webdriver'))

    # html を書き換える
    # getElementsByTagName() で html タグを指定しているのでその部分が innerHTML の値に書き変わる
    # innerHTML で href 属性を追加してアクセスしたい URL を記入する
    selem.driver.execute_script(
        f'var tag=document.getElementsByTagName("html");tag[0].innerHTML="<a id=link href={url}>本文</a>";')

    # 書き換えた HTMLを表示
    print(selem.driver.find_element(By.TAG_NAME, "html").get_attribute('outerHTML'))

    # 追記した a要素をクリックしてアクセスしたい url にいく
    selem.driver.execute_script('document.getElementsByTagName("a")[0].click();')
    print(f"{selem.driver.current_url = }")

    # テキスト属性を取得する
    print(selem.driver.find_element(By.XPATH, '//p[@class="sc-kQFbVZ fJbJxa"]').text)

finally:
    print("end")
    selem.driver.quit()
