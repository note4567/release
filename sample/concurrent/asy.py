#!/usr/bin/env python
""" [コルーチン]
    asyncio によるクローリング
    注意点としてスクリプトファイル名を asyncio.py のように asyncio を用いない事。
    これは requests の所で非同期になってない(aiohttp が無い)ので中途な結果になる。
"""

import asyncio
import time
import requests
lock = asyncio.Lock()

header = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko)'
                  'Chrome/56.0.2924.76 Safari/537.36'
}
urls = ["https://twitter.com/home?lang=ja", "https://ja-jp.facebook.com/", "https://www.ent.lawson.co.jp/company/",
        "https://www.youtube.com/",
        "https://jp.loccitane.com/on/demandware.store/Sites-OCC_JP-Site/ja_JP/Stores-Find",
        "http://www.moriya.co.jp/", "https://www.takashimaya.co.jp/store/", "https://kidshd.co.jp/shops/"]


async def get_url():
    """ url を返す """
    # リスト内のURLに対して非同期でスクレイピングを実行
    # await がないと実行されない
    async with asyncio.Lock():
        scraping_results = await asyncio.gather(*[scraping(url) for url in urls])
        return scraping_results


async def scraping(url):
    """ リクエストする """
    async with asyncio.Lock():
        print("get:", url)
        result = requests.get(url, headers=header)
        return result.status_code


async def main():
    results = await get_url()
    print(results)


start = time.time()
# 非同期処理開始
asyncio.run(main())
print("[End :asyncio]", time.time() - start)
