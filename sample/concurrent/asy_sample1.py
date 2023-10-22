#!/usr/bin/env python
""" [コルーチン]
    asyncio のサンプル
"""

import asyncio
import time


async def get_url():
    args = [1, 2, 3, 4]
    scraping_results = await asyncio.gather(*[scraping(val) for val in args])
    return scraping_results


async def scraping(val):
    print("[Wait_Start]:", val)
    await asyncio.sleep(val)
    print("[Wait_End]:", val)


async def main():
    results = await get_url()
    print(results)


start = time.time()
# 非同期処理開始
asyncio.run(main())
print("[End :asyncio]", time.time() - start)
