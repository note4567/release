#!/usr/bin/env python
""" [質疑応答モデル] """
# pip install transformers==4.37.0.dev0
# pip install jax jaxlib
# pip install flax

from transformers import BertJapaneseTokenizer, AutoModelForQuestionAnswering
import torch

# 入力テキスト
context = "saasasp;m10臨時営業時間のお知らせ月～金：07:59～24:00土：01:00～18:00定休日日・祝アクセスタクシー30分／\n"
context = "-0002千葉県浦安市北栄１‐１３‐２５西友浦安店パート２館１Ｆ電話番号047-381-4365平日営業時間06:45-21:45土曜営業時間07:00-21:30日祝営業時間07:00-21:30総席数58"
question = "営業時間は?"

# モデルとトークナイザーの準備
print("-"*32)
tokenizer = BertJapaneseTokenizer.from_pretrained('cl-tohoku/bert-base-japanese-whole-word-masking')
model = AutoModelForQuestionAnswering.from_pretrained('./output', from_flax=True)

# 推論の実行
inputs = tokenizer.encode_plus(question, context, add_special_tokens=True, return_tensors="pt")
input_ids = inputs["input_ids"].tolist()[0]
output = model(**inputs)
answer_start = torch.argmax(output.start_logits)
answer_end = torch.argmax(output.end_logits) + 1
answer = tokenizer.convert_tokens_to_string(tokenizer.convert_ids_to_tokens(input_ids[answer_start:answer_end]))

# 結果出力
print("質問: "+question)
print("応答: "+answer)

c_l = ["港区1-1-6sa10臨時営業時間のお知らせ月～金：07:59～24:00土：01:00～18:00駐車場あり\n",
      "瑞穂区役所駅／1番口徒歩23分営業時間の月～金：07:59～24:00土：01:00～18:00駐車場あり\n",
      "m639-1101奈良県大和郡山市下三橋町741イオンモール大和郡山電話番号0743-58-5123営業時間10:00～21:00定休日不定休アクセス電車郡山（奈良県）駅／東出口（ＪＲ西日本）徒歩16分近鉄郡",
      "ださい。サービスMobileOrder&amp;Pay※台風、その他災害等により、予告なく臨時休業や営業時間を変更をさせて頂くことがありますが、あらかじめご了承下さい。※在庫・販売状況について、お電話でのお問\n",
      "444-0827愛知県岡崎市針崎町岡崎駅南土地区画整理事業27街区5電話番号0564-72-7377営業時間08:00～22:00定休日不定休アクセス電車岡崎駅／西口（ＪＲ東海、愛知環状鉄道）徒歩14分六名駅"]

for context in c_l:
    inputs = tokenizer.encode_plus(question, context, add_special_tokens=True, return_tensors="pt")
    input_ids = inputs["input_ids"].tolist()[0]
    output = model(**inputs)
    answer_start = torch.argmax(output.start_logits)
    answer_end = torch.argmax(output.end_logits) + 1
    answer = tokenizer.convert_tokens_to_string(tokenizer.convert_ids_to_tokens(input_ids[answer_start:answer_end]))
    # 結果出力
    print("質問: "+question)
    print("応答: "+answer)
