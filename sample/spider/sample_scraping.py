#!/usr/bin/env python

""" [スクレイピング処理]
    例として Q&Aサイトの場合
    詳細ページの・質問・回答・ベストアンサー・質問者からのお礼コメントを MongoDBに保存する

    ・詳細ページのHTMLを取得
    MongoDB の html項目から HTML を取得し BeautifulSoup() に渡す。

    ・BeautifulSoup() によるスクレイピング
    css セレクタにより必要事項を抽出する。
    抽出した項目を辞書で定義する。

    ・定義された辞書を MonoDB へ保存する
    key 毎に更新処理(update)を実行する。 """

from bs4 import BeautifulSoup
# DB処理に必要なモジュール
from mongodb import db_mongo
import json

# DB への接続処理
db = db_mongo.DbHandler(". Enter database name . Enter collection name")


""" [update 処理を key毎に実行]
    ・BeautifulSoup() によりHTMLをスクレイピングする
    スクレイピング結果を set_item(辞書) に定義する
    この set_item を update句で用いられる "$set" の値にする
    
    ・set_item に必要な項目は以下である。
    question : 質問
    answers : 回答の集まりの辞書。
              key: 連番の値。
              value: 個別の回答(辞書)
              個別の回答につき
              key: answer
              value: 回答
    best_answer : 質問に対するベストアンサー(無い場合もある)
    thanks : 回答に対する質問者のお礼コメント """

for item in db.find({}):
    # 各種辞書やカウンターを用意
    set_item = {}
    answer = {}
    question_text = "Nothing"
    best_answer_text = "Nothing"
    thanks_text = "Nothing"
    answer_count = 1

    """ [スクレイピング処理] """
    print(f"key: {item['key']}")
    for content in item["content"]:
        print(f"[Start] page: {content['page']}")
        soup = BeautifulSoup(content["html"], "html.parser")
        # 1ページ目の場合は、質問を取得する
        if content["page"] == 1:
            question_tag = soup.select('#id div.sample > div > p')
            # ページに規制がある場合、詳細ページは表示されない。
            if question_tag:
                question_text = question_tag[0].get_text(strip=True)
                print(f"question: {question_text}")
                print()

        # ベストアンサーの処理。受付が終了したものにはある。
        best_answer_tag = soup.select('#id div.sample > div > h2')
        if best_answer_tag:
            best_answer_text = best_answer_tag[0].get_text(strip=True)
            print(f"::::: best_answer :::::\n {best_answer_text}")

        # ベストアンサーに対する質問者のお礼コメント
        thanks_tag = soup.select('#id div.Thanks > div > p')
        if thanks_tag:
            thanks_text = thanks_tag[0].get_text(strip=True)
            print(f"::::: Thanks :::::\n {thanks_text}")

        # 回答を取得
        answer_li = soup.select('#answer div.sample > div > h2')
        for ans in answer_li:
            answer_text = ans.get_text(strip=True)
            print(f"count: {answer_count}  {answer_text}")
            answer[str(answer_count)] = {"answer": answer_text}
            answer_count += 1
            print()

        print(f"[End] page: {content['page']}")

    """ [set_item の定義]
        質問、回答、ベストアンサー、質問者からのお礼を設定 """
    set_item["question"] = question_text
    set_item["answers"] = answer
    set_item["best_answer"] = best_answer_text
    set_item["thanks"] = thanks_text

    """ [update処理] """
    print("[update]")
    conditions = {"key": item["key"]}
    operator = {"$set": set_item}
    db.update(conditions, operator)
    print()


""" [更新処理の確認]
    json.dumps() により辞書を整形表示する。
    その為、db.find() では ObjectId を非表示にする
    また、日本語による文字化けに対処するので ensure_ascii=False を設定する """
for item in db.find({}, {"content": {"html": 0}, "_id": 0}):
    print(json.dumps(item, indent=2, ensure_ascii=False))
    print()
