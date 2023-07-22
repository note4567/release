#!/usr/bin/env python

# Database Module

import pymongo


#class DbPermalink:
class DbHandler:
    def __init__(self, name):
        """
        DB の初期処理(コレクション・index 生成)
        コレクション名を引数 nameにより動的に作成する
        :param name: .DatabaseName.CollectionName
        """
        # 接続処理
        self.client = pymongo.MongoClient("address:port")

        # コレクション名を動的に作成
        self.collection = eval("self.client" + eval('name'))

        # データを一意に識別するキーを格納する key フィールドにユニークなインデックスを作成する
        # 既に存在している場合は実行しない
        if "key_1" not in self.collection.index_information():
            self.collection.create_index([('key', 1)], unique=True)
            print("::: create_index :::   key")


    def find(self, conditions=None, proj=None):
        """
        フィールドを表示する
        :param conditions: 検索条件
        :param proj: 表示条件
        :return: yield item
        """
        
        for item in self.collection.find(filter=conditions, projection=proj):
            yield item


    def check_key(self, key):
        """
        key フィールドの値を調べる
        :param key:
        :return: 該当する key が存在しない場合は None が返る
        """

        return self.collection.find_one({'key': key})

    def insert(self, obj):
        """
        フィールドを挿入する
        :param obj:
        :return None:
        """

        self.collection.insert_one(obj)

    def update(self, conditions=None, operator=None):
        """
        フィールドの更新
        :param conditions: 検索条件
        :param operator: 更新処理
        :return: None
        """

        self.collection.update_many(conditions, operator)

    def count(self):
        """
        フィールドの件数を表示
        :return: ドキュメント総数
        """

        return self.collection.estimated_document_count()
