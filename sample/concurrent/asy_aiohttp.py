#!/usr/bin/env python
""" [コルーチン]
    asyncio と aiohttp のクローリング """

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
    """ url を返す """
    async with aiohttp.ClientSession() as session:
        scraping_results = await asyncio.gather(*[scraping(url, session) for url in urls])
        return scraping_results


async def scraping(url, session):
    """ リクエストする """
    async with session.get(url, headers=header) as result:
        print("get:", url)
        return result.status


async def main():
    results = await get_url()
    print(results)


start = time.time()
# イベントループを作成して非同期処理を実行
# Python 3.7以降はこちらで OK
asyncio.run(main())

# Python 3.7 以前の場合
# loop = asyncio.get_event_loop()
# loop.run_until_complete(main())

print("[End :asyncio]", time.time() - start)
