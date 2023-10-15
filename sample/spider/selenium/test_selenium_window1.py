#!/usr/bin/env python
""" ウインドウの遷移
    driver.switch_to.window """

from selenium.webdriver import Chrome, ChromeOptions
from selenium.webdriver.common.by import By

# selenium の起動
options = ChromeOptions()
# ヘッドレスモードで実行する
options.headless = True
options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                     'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36')
# virtualbox 上の ubuntu でこのスクリプトを実行する場合に chromedevtools につき必要な記述
options.add_argument("--remote-debugging-port=9222")
driver = Chrome(options=options)

try:
    url = "--------------- URL ---------------"
    driver.get(url)
    print(f"{driver.current_url = }\n")

    # リンクを取得
    elements = driver.find_elements(By.XPATH, '//li[@class="LabelListItem"]/a')
    link_url = elements[0].get_attribute("href")

    # 現在のウインドウハンドルを表示
    print("[Before Open]")
    print(driver.window_handles)
    print("[current_window]", driver.current_window_handle, "\n")

    # 新規ウインドウを開いた後のウインドウハンドルを表示
    driver.execute_script(f"window.open('{link_url}');")
    print("[Window Open]")
    print(driver.window_handles)
    print("[current_window]", driver.current_window_handle)
    print(f"{driver.current_url = }\n")

    # ウインドウハンドルを新規ウインドウに切り替える
    driver.switch_to.window(driver.window_handles[-1])
    print("[Switch Window]")
    print("[current_window]", driver.current_window_handle)
    print(f"{driver.current_url = }\n")

    # 新規ウインドウを閉じる
    driver.close()
    print("[Close Window]")
    # 新規ウインドウを閉じると以下はエラーになるのでウインドウを戻す必要がある。
    # print("[current_window]", driver.current_window_handle, "\n")

    driver.switch_to.window(driver.window_handles[-1])
    print("[Switch Window]")
    print(driver.window_handles)
    print("[current_window]", driver.current_window_handle)
    print(f"{driver.current_url = }")

finally:
    driver.quit()
