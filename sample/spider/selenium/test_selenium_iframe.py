#!/usr/bin/env python
"""   iframe を表示させる  """

from selenium.webdriver import Chrome, ChromeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import TimeoutException
import fake_useragent


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
        # SSL認証(この接続ではプライバシーが保護されません)を無効
        options.add_argument('--ignore-certificate-errors')
        options.add_argument('--ignore-ssl-errors=yes')
        # Chromeの保護機能を無効
        options.add_argument('--no-sandbox')
        # 初期のウィンドウサイズを指定
        options.add_argument('--window-size=1920,1080')
        # ユーザーエージェントの偽装
        fake_ua = fake_useragent.UserAgent()
        print(fake_ua.random)
        options.add_argument(f'user-agent={fake_ua.random}')
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
#ttps://www.takashimaya.co.jp/kyoto/departmentstore/access/"
url = ".......URLを指定"
selem = SeleniumStart(url)

try:
    # キャッシュを残さない
    selem.driver.execute_cdp_cmd("Network.setCacheDisabled", {"cacheDisabled": True})

    print("navigator.webdriver:",selem.driver.execute_script('return navigator.webdriver'))

    elements = selem.driver.find_elements(By.XPATH, '//p[contains(text(), "代表TEL")]')
    print(elements[0].get_attribute("textContent") if elements else "")

    try:
        wait = WebDriverWait(selem.driver, 10)
        wait.until(expected_conditions.presence_of_element_located((By.ID, 'sys_load_frame')))
    except TimeoutException as e:
        print("[Error]", e)

    iframe_element = selem.driver.find_element(By.ID, 'sys_load_frame')
    selem.driver.switch_to.frame(iframe_element)
    elements = selem.driver.find_elements(By.XPATH, '//p[contains(text(), "代表TEL")]')
    print(elements[0].get_attribute("textContent") if elements else "")

    # もとのフレームに戻る場合
    # selem.driver.switch_to.default_content()

finally:
    print("end")
    selem.driver.quit()
