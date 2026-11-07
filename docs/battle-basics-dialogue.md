# 基礎記事の会話サンプル

2026-11-07時点では `same-type-attack-bonus` のみ公開対象。残り46記事への展開はユーザー確認後の指示を待つ。

## 本文

`content/battle-basics.ts` のsectionに任意の `dialogue` を追加。話者は `professor` / `trainer`。各発言は複数段落に対応し、表情は `neutral` / `happy` / `surprised` / `thinking` / `confused` / `inspired`。会話sectionの `paragraphs` は空配列とし、同じ本文を二重管理しない。sectionの見出し・facts・takeawayは従来どおり使える。

## 画像

ユーザーが承認したオリジナル生成イラストの12表情sheetを `public/images/battle-basics/dialogue-characters.png` に保存。元の絵柄は比較案Cの太く不揃いな線とベタ塗り。博士は白ひげ・白衣・緑シャツ、新人は赤白帽子・赤ベスト。

画像は1086 × 1448px、3列 × 4行、1セル362px四方、RGBA透過。1〜2行目が博士、3〜4行目が新人。各人物の読み順は通常・笑顔・驚き・考え中・困り顔・ひらめき。

`battle-basics-dialogue.tsx` は元画像を編集せず、各セルをCSSで切り出す。Next Imageのサイズ指定と最適化を利用し、同一画像を共有する。画像自体は装飾扱いとし、話者名を吹き出しの上に表示する。

## 公開確認

スマホとPCで、画像の読み込み、横はみ出し、吹き出し、前後記事へのリンクを確認する。既存の非会話記事も確認する。倍率の説明は基本1.5倍、弱点2倍との合算3倍、半減との合算0.75倍で、能力や技の威力等の他条件が同じ場合の説明として扱う。
