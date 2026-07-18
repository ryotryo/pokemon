# Pokémon Champions Party Matchup Checker

Pokémon Champions専用のスマートフォン向けパーティー相性チェッカーです。Championsの使用技TOP10から、パーティーが各ポケモンの弱点をつけるかを診断します。

- シングル／ダブル対応
- Pokémon Champions収録ポケモンの全件診断
- メガ進化・独立フォーム対応
- 日本語名検索、弱点タイプ、有効技の表示
- 閲覧時の外部API通信なし

## ローカル起動

Node.js 22以上を使用します。

```bash
npm ci
npm run dev
```

`http://localhost:3000/` を開いてください。

## データ更新

```bash
npm run data:update
```

Champions Battle Dataの最新シーズンを検出し、取得→正規化→検証の後、成功時のみ `data/` の静的JSONを更新します。閲覧時はこの静的JSONだけを使用します。

## データソース

- [Champions Battle Data](https://championsbattledata.com/): 最新シーズン、シングル／ダブル順位、使用技TOP10、ポケモン・フォーム情報
- [PokéAPI](https://pokeapi.co/): Champions由来の技に対するタイプ、`damage_class`、`meta.category`、日本語技名と、日本語表示名の補助のみ

PokéAPIはランキング、使用率、Championsの登場ポケモン判定には使用しません。

## 確認コマンド

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## GitHub Actions

`.github/workflows/update-champions-data.yml` が1日1回データを自動更新します。GitHubのActions画面から `workflow_dispatch` による手動実行も可能です。検証失敗時は前回の正常JSONを維持します。

## 注意

本ツールは非公式であり、Pokémon、Nintendo、Game Freak、Creaturesとは関係ありません。
