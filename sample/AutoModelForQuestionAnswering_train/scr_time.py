#!/usr/bin/env python
"""   営業時間周辺のテキストを取得する  """
import re
import glob
import sys

# htmlファイルの読み込み
dir_path = './doutor/html'
files = glob.glob(dir_path + '/*.html')
for file in files:
    with open(file, 'r') as f:
        html_text = f.read()
        # 正規表現を使用してHTMLタグを取り除く
        text = re.sub(r"<script>.+?</script>", "", html_text, flags=re.DOTALL)
        text = re.sub(r"<.+?>|<!--.+?-->|\s|:\{.+?}|\s|: \{.+?}", "", text, flags=re.DOTALL)
        text = re.sub(r"<!--.+?-->", "", text)
        text = re.findall(".{50}営業時間.{50}", text)
        for t in text:
            print(t)
            print(file=sys.stderr)
