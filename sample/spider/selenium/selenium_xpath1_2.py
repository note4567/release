#!/usr/bin/env python
""" Xpath を使う
    URL: ---------------------------------------------
    Type: 一覧ページ → 詳細ページ → next 一覧ページ
    [取得方法]
    1: Top ページより 検索ボタンに空白を入れてクリックしてリンク一覧ページを表示させる
    2: 一覧ページから詳細ページのリンクを取得する
    3: next ページが無くなるまでクロールしてリンクを取得する
    4: 詳細ページは各々 HTMLが異なるので場合わけをする
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
    @retry(stop=stop_after_attempt(10))
    def __init__(self, url):
        options = ChromeOptions()
        # ヘッドレスモードで実行する
        options.headless = True
        options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                             'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36')
        # virtualbox 上の ubuntu でこのスクリプトを実行する場合に chromedevtools につき必要な記述
        options.add_argument("--remote-debugging-port=9222")
        self.driver = Chrome(options=options)
        self.base_url = '------------------------------------------------------------------------------------------'
        self.driver.get(url)
        print("[driver] Start", f"{id(self.driver)}")


    def close(self):
        self.driver.quit()
        print("[driver] End")


class Soup:
    """
    beautifulsoup の処理
    ・XPath を利用可能にする
    ・詳細ページのアイテムを取得する定型処理
    """

    def __init__(self, url):
        """ XPath を利用可能にする """
        header = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) '
                                'Chrome/56.0.2924.76 Safari/537.36', 'Accept-Language': 'ja'}
        response = requests.get(url, headers=header)
        soup = BeautifulSoup(response.text, 'html.parser')
        self.soup = html.fromstring(str(soup))

    def get_element(self, path):
        elements = self.soup.xpath(path)
        return elements[0].text_content().strip() if elements else ""

    def get_elements(self, path):
        elements = self.soup.xpath(path)
        return elements if elements else ""

    def get_item(self):
        item_data = {}
        key_list = ["住所", "電話番号", "FAX", "営業時間", "交通アクセス", "決済手段", "店内施設・施設情報"]
        for item_key in key_list:
            if item_key == "電話番号":
                item_data["TEL"] = self.get_element(f'//th[contains(text(), "{item_key}")]//following-sibling::td')
                continue
            item_data[item_key] = self.get_element(f'//th[contains(text(), "{item_key}")]//following-sibling::td')

        return item_data

    def get_item_shopseinan(self, section):
        item_data = {}
        key_list = ["住所", "電話番号", "FAX", "営業時間", "交通アクセス", "決済手段", "店内施設・施設情報"]
        self.soup = section
        for item_key in key_list:
            if item_key == "電話番号":
                item_data["TEL"] = self.get_element(f'.//th[contains(text(), "{item_key}")]//following-sibling::td')
                continue
            item_data[item_key] = self.get_element(f'.//th[contains(text(), "{item_key}")]//following-sibling::td')

        return item_data

    def get_item_petshop(self):
        item_data = {}
        key_list = ["〒", "TEL", "FAX", "営業時間", "交通アクセス", "決済手段", "店内施設・施設情報"]
        for item_key in key_list:
            if item_key == "〒":
                item_data["住所"] = \
                    self.get_element(f'//div[@class="shop_info"]//ul//li[contains(text(),"{item_key}")][1]')
                continue
            item_data[item_key] = \
                self.get_element(f'//div[@class="shop_info"]//ul//li[contains(text(),"{item_key}")][1]')

        return item_data


def regx(data):
    """ 正規表現処理 """
    for k in ["TEL", "FAX"]:
        if match := re.search(r"[0-9-]+", data[k]):
            data[k] = match.group(0)
    data["営業時間"] = re.sub(r"営業時間", "", data["営業時間"])
    data["住所"] = re.sub(r"地図・混雑情報を見る", "", data["住所"])

    return data


@retry(stop=stop_after_attempt(10))
def get_urls():
    top_url = '------------------------------------------------------------------------------------------'
    selm = SeleniumStart(top_url)
    counter = 1
    try:
        # input 要素を取得
        input_element = selm.driver.find_element(By.XPATH,'//input[@class="shop-input-input js-keyword-input"]')
        # input 要素に " "(スペース)を入力
        # 但しこのサイトの場合は '' の中に " " を記入する必要がある。
        input_element.send_keys('" "')
        # button 要素を取得(検索ボタン)
        button_element = selm.driver.find_element(By.XPATH, '//button[@class="shop-input-btn js-keyword-btn"]')

        # スペースが入力された状態で検索ボタンをクリックする。
        selm.driver.execute_script("arguments[0].click();", button_element)
        link_page = selm.driver.current_url
        print(link_page)
        selm.close()
        for _ in range(1000):
            # next が無くなるまで一覧ページをクロール
            selm = SeleniumStart(link_page)
            # 詳細ページのリンクを取得
            link_elements = selm.driver.find_elements(By.XPATH,
                                                      '//a[@class="shop-favList-title-name mod-btn_left rt_cf_s_href"]')
            for link_element in link_elements:
                url = link_element.get_attribute("href")
                print(f"[{counter}]", url)
                counter += 1
                yield url
            # nextページを取得
            if next_elements := selm.driver.find_elements(By.XPATH,
                                                          '//a[@class="mod-pager-list-next rt_bn_shops_list_page-next"]'):
                link_page = next_elements[0].get_attribute("href")
                print(f"[Next_page] {link_page}")
            else:
                break
            selm.close()
    except Exception as e:
        print("[Error]", e)
    finally:
        selm.close()


def fetch_shop(url):
    try:
        data_list = []
        bs = Soup(url)
        # 各店舗毎に場合わけする(ページ毎に HTMLが異なる)
        if "https://.....................................................'keiyo/" in url:
            return data_list
        # 3店舗分がまとまっている
        if "/ouchi_shop/" in url:
            print("[ouchi_shop]")
            # 発寒追分通店 厚別東店 盛南店 の3店舗分を1回で取得する
            # #shopseinan #shopAtsubetsu #shopHassamu は同一の URL
            # #shopAtsubetsu #shopHassamu の場合は空の data_list を返す
            if "/ouchi_shop/#shopseinan" in url:
                section_list = bs.get_elements('//h2[@class="mod-head06"]/parent::section')
                print("[ouchi_shop#shopseinan]")
                for section in section_list:
                    data = bs.get_item_shopseinan(section)
                    data["事業所名"] = section.xpath('.//h2')[0].text
                    data["URL"] = url
                    data_list.append(data)
            return data_list

        # ペットショップ用
        if "/petshop/" in url:
            print("[petshop]")
            data = bs.get_item_petshop()
            data["事業所名"] = bs.get_element('//ul//h3')
            data["URL"] = url
            data_list.append(data)
            return data_list

        if "/homac-fukushi/" in url:
            print("[homac-fukushi]")
            return data_list
        if "/fukushi/" in url:
            print("[fukushi]")
            return data_list

        # 1店舗分
        data = bs.get_item()
        name = bs.get_element('//h1//span[@class="rt_cf_s_shop_name"]')
        print(name)
        data["事業所名"] = name
        data["URL"] = url
        data_list.append(data)
        return data_list

    except Exception as e:
        print("[Error]", e)


for data_ in chain.from_iterable(map(fetch_shop, get_urls())):
    print("-" * 46)
    if data_:
        data_ = regx(data_)
        [print(k, ":", v) for k, v in data_.items()]
    print("-" * 46)
