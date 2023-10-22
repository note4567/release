#!/usr/bin/env python
""" [マルチスレッド]
    ThreadPoolExecutor(マルチスレッド) によるクローリング
    executor.submit() を使う場合。
    並行処理には requests モジュールを使う。
"""
from concurrent.futures import ThreadPoolExecutor, as_completed
import time
import requests

header = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko)'
                        'Chrome/56.0.2924.76 Safari/537.36'}
urls = ["https://twitter.com/home?lang=ja", "https://ja-jp.facebook.com/", "https://www.ent.lawson.co.jp/company/",
        "https://www.youtube.com/",
        "https://jp.loccitane.com/on/demandware.store/Sites-OCC_JP-Site/ja_JP/Stores-Find",
        "http://www.moriya.co.jp/", "https://www.takashimaya.co.jp/store/", "https://kidshd.co.jp/shops/"]


def get_url():
    """ url を返す """
    for url in urls:
        yield url


def scraping(url):
    """ リクエストする """
    print("get:", url)
    result = requests.get(url, headers=header)
    return result.status_code


# 逐次処理
start = time.time()
print(list(map(scraping, get_url())))
print("[End]", time.time() - start)
print()

# マルチスレッド処理
start = time.time()
with ThreadPoolExecutor(max_workers=2) as executor:
    # executor.submit() により個々のタスクを実行し Future オブジェクトを返してタスクの完了を待つ
    futures = [executor.submit(scraping, url) for url in get_url()]
    # as_completed() により完了したタスクの結果を順次処理
    for future in as_completed(futures):
        print(future.result())

print("[End :ThreadPoolExecutor]", time.time() - start)
