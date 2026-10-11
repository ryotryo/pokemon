# トップページの道具アイコン

トップページの装飾アイコンは `public/images/home-items/` に保存し、外部画像配信サービスに依存せず表示します。道具画像はナビゲーションの装飾であり、Championsでの持ち物の使用可否や対戦データを示すものではありません。

ドット絵ではなく、輪郭が滑らかな道具画像を使用します。表示サイズは28pxで、`image-rendering: pixelated`は指定しません。元画像を加工せず保存しています。画像の権利は Nintendo / Game Freak / The Pokémon Company に帰属します。

取得元:

- Champions Battle Data: `https://championsbattledata.com/pokemon_champions_assets/items/`（40×40px）
- [PKHeX Artwork Items](https://github.com/kwsch/PKHeX/tree/66ef5983a5d349efa2dd615f2926a1b1ee97306e/PKHeX.Drawing.PokeSprite/Resources/img/Artwork%20Items): 元画像は23〜28pxの幅、23〜28pxの高さ。道具IDと日本語名は同じcommitの `PKHeX.Core/Resources/text/items/text_Items_ja.txt` で確認しています。

| コンテンツ | 道具 | ローカルファイル | 取得元パス |
| --- | --- | --- | --- |
| タイプ相性表 | じゃくてんほけん | weakness-policy.png | PKHeX: aitem_639.png |
| 相性チェッカー | とくせいガード | ability-shield.png | PKHeX: aitem_1881.png |
| すばやさランキング | こだわりスカーフ | choice-scarf.png | Champions: Choice Scarf.png |
| 使用率ランキング | マスターボール | master-ball.png | PKHeX: aitem_1.png |
| ダメージ早見表 | パンチグローブ | punching-glove.png | PKHeX: aitem_1884.png |
| 技からポケモン検索 | ピーピーエイド | ether.png | PKHeX: aitem_38.png |
| どんなポケモン？ | ものしりメガネ | wise-glasses.png | Champions: Wise Glasses.png |
| 対戦の基礎 | せんせいの爪 | quick-claw.png | Champions: Quick Claw.png |
| 対戦ポケモンの役割 | ピッピにんぎょう | poke-doll.png | PKHeX: aitem_63.png |
