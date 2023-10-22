#!/usr/bin/env python
""" [コルーチン]
    asyncio と aiohttp のクローリング
    Semaphore() (セマフォ) により非同期処理に制限をかける
    リクエストごとに新しいセッションを使用して、新規接続として接続する
"""

import asyncio
import time
import aiohttp

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
    # 同時に 2つのタスクを許可
    sem = asyncio.Semaphore(2)
    scraping_results = await asyncio.gather(*[scraping(url, sem) for url in urls])
    return scraping_results


async def scraping(url, sem):
    """ リクエストする
        aiohttp.ClientSession() を scraping関数内で作成し、
        各リクエストごとに新しいセッションを使用するように変更し、
        接続が新しいものとして確立されるようにする """
    async with sem, aiohttp.ClientSession() as session:
        async with session.get(url, headers=header) as result:
            print("get:", url)
            return result.status


async def main():
    results = await get_url()
    print(results)

start = time.time()
# 開始処理
asyncio.run(main())
print("[End :asyncio]", time.time() - start)
