#!/usr/bin/env python
""" [クローリング処理]

    [詳細ページの取得]
    目的: 取得したいサイトのリンク(一覧ページ)を辿り詳細ページの HTMLを取得する
    手段: Start ページからリンクを辿り詳細ページへいく
    リンクページ(一覧ページ)は、上限の100ページまで辿っていく。
    詳細ページにもページネーション(次ページ)がある場合も、全て辿っていく。
    Start_url = https:// ~ URL ~

    [CrawlSpider による実装]
    CrawlSpider によりリンクを辿る
    データベースは MongoDB を用いる。
    接続処理等は mongodb の db_mongo モジュールを用いる。

    [bash でのコマンド例]
    scrapy crawl sample_crawling > ./sample_$(date "+%Y%m%d").text 2>&1   """

from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor

# DB処理に必要なモジュール
from mongodb import db_mongo
import re


# 取得した htmlファイルを数えるカウンター
counter = 1


class ChiebukuroCrawlSpider(CrawlSpider):
    name = ' Enter name '
    allowed_domains = [' Enter domain name ']
    start_urls = [' Enter URL ']

    # リンクを辿る為のルールのリスト
    rules = (
        # 一覧ページ(リンクページのページネーション)
        # 999ページまで取得
        # ページの部分が b= などで規定されている場合、正規表現で URL末尾の b= の数字の部分を規定する。
        Rule(LinkExtractor(allow=r'/Path .+b=[0-9]{2,3}')),
        # 一覧ページ(詳細ページへのリンク)
        # 詳細ページにもページネーション(複数ページに跨る)がある場合がある。
        # 故に follow を True に設定して callback関数がある場合でもリンクを辿らせる。
        Rule(LinkExtractor(allow=r' Enter URL '), callback="parse", follow=True),
        # 詳細ページ(ページネーション)
        # 複数のページがある場合は、全て辿る。
        # ページの部分が  page=  などで規定されている場合、URL末尾の page= の数字部分を正規表現にする
        Rule(LinkExtractor(allow=r'/detail/.+?page=[0-9]+'), callback="parse"),
    )

    # DBへの接続処理(ハンドラーの取得)
    db = db_mongo.DbHandler(". Enter database name . Enter collection name")

    def parse(self, response, **kwargs):
        """
        詳細ページの処理
        :param response:
        :param kwargs:
        :return None:
        """

        global counter
        # タイトルやURLなどを表示
        print(f"[Detail {counter}]")
        print(response.url)
        print(response.css('head > title').xpath('string()').get().strip())

        # DBへ HTMLを保存
        print(f"[get html]")
        self.save(response)
        counter += 1

    @staticmethod
    def get_key(st):
        """
        URL からキー(URL中の q と ? に挟まれた数字を key にする場合)を取得する
        :param st
        :return: key
        """

        reg = r'(?<=q)[0-9]+(?=\?)'
        return re.search(reg, st).group()

    @staticmethod
    def get_page(st):
        """
        URL から詳細ページのページ番号(URLの末尾に規定されている場合)を取得する
        :param st:
        :return: page_number
        """

        reg = r'[0-9]+$'
        return re.search(reg, st).group()

    def save(self, response):
        """
        MongoDB へ詳細ページのHTMLを挿入する
        1ページ目は insert処理を実行。この際に key値を設定する。
        2ページ目以降は、既にデータが存在する(key値がある)ので update処理。
        :param response:
        :return None:
        """

        # key値の取得
        key = self.get_key(response.url)
        print(f"key: {key}")

        # key値による存在チェック
        item = self.db.check_key(self.get_key(response.url))
        if item:
            """ [2ページ目以降の update処理]
                page は順次ページ番号を設定
                html は既に設定されているものを一旦リスト(content_li)に代入し、
                新たな html を順次そのリスト(content_li)に追加していく """

            print("[update]")
            page_number = self.get_page(response.url)
            print(f"{counter} [page_{page_number}]")

            # 既存の htmlを一旦取り出す
            content_li = item["content"]
            # 新規の htmlを追加する
            content_li.append({"page": page_number, "html": response.text})

            # update句で用いられる "$set" の値として dataを定義する
            data = {"content": content_li}
            conditions = {"key": key}
            operator = {"$set": data}
            self.db.update(conditions, operator)
            print()
        else:
            """ [1ページ目の insert処理]
                key を設定
                page は 1に設定する
                html はリスト化(content_li)して格納する """

            print("[insert]")
            print(f"{counter} [page_1]")
            content_li = [{"page": "1", "html": response.text}]
            data = {"key": key, "page_type": "detail", "content": content_li}
            self.db.insert(data)
            print(self.db.check_key(self.get_key(response.url))["key"])
