#!/usr/bin/env python
"""   営業時間につき JSONファイル取得する  """
import re
import json

# 読み込むファイルパス
file_path = "./starbucks_time.txt"
# Jsonに出力する辞書を保存するリスト
qa_list = []

# テキストファイルの読み込み squad 形式に整形する
with open(file_path, 'r', encoding="utf_8") as f:
    for i, text in enumerate(f):
        print(text)
        # is_impossible が True は回答不能を表す
        is_impossible = False
        # 臨時営業時間は回答不能にする
        if re.search(r"臨時営業時間|臨時休業", text):
            is_impossible = True
            # print("aa")
        # 営業時間表記が xx:xx で無いものは回答不能
        if not re.search(r"[0-9]{1,2}:[0-9]{1,2}", text):
            is_impossible = True
            # print("aa")
        # 営業時間の記載がある文章については、該当する営業時間とその位置(開始位置)を抽出する
        if not is_impossible:
            answer = re.search(r"(?<=営業時間).+:[0-9]{1,2}", text).group()
            answer_start = re.search(r"[0-9]{1,2}:[0-9]{1,2}", text).start()
            # ans = text[answer_start:re.search(r"[0-9]{1,2}:[0-9]{1,2}", text).end()]
            # print("-"*22,ans)

        # 回答不可かどうかで切り分ける
        if is_impossible:
            # 回答不能な場合
            d = {
                'context': text,
                'qas': [
                    {
                        'id': i,
                        'is_impossible': True,
                        'question': "営業時間は?",
                        'answers': []
                    }
                ]
            }
        else:
            # 回答可能な場合
            d = {
                'context': text,
                'qas': [
                    {
                        'id': i,
                        'is_impossible': False,
                        'question': "営業時間は?",
                        'answers': [
                            {
                                'text': answer,
                                'answer_start': answer_start
                            }
                        ]
                    }
                ]
            }
            # print(d)
        print(json.dumps(d, ensure_ascii=False, indent=4))
        qa_list.append(d)
        print()

# [データの分割]
# データの配分は 学習用:70% 検証用:15% テスト用:15%
# データ件数が全体で 1900件 なので 学習用:1330 検証用:285 テスト用:285
train_size = int(len(qa_list) * 0.7)
dev_size = int(len(qa_list) * 0.15)
# test_size = int(len(qa_list) * 0.15)
out_file_li = {"./starbucks_train.json": qa_list[:train_size],
               "./starbucks_dev.json": qa_list[train_size:train_size + dev_size],
               "./starbucks_test.json": qa_list[train_size + dev_size:]}


# [Jsonファイルに出力]
for out_file, data in out_file_li.items():
    with open(out_file, 'w') as f:
        # for li in qa_list[100:]:
        d = {"version": "v2.0", "data": [{"title": "営業時間", "paragraphs": data}]}
        json.dump(d, f, ensure_ascii=False, indent=4)
