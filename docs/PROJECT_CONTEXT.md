# Poké Analytics プロジェクト概要

## プロジェクト

Poké Analyticsは、Pokémon Championsの対戦データを分析し、対戦初心者の理解を助ける非公式Webサイトです。スマートフォンを優先した、日本語・コンパクト・情報密度の高いUIを採用しています。

- フレームワーク: Next.js 16 App Router、React 19
- 言語・UI: TypeScript、Tailwind CSS 4
- 検証: Vitest、ESLint、TypeScript
- データ配信: 更新時に生成したリポジトリ内の静的JSONを使用し、閲覧時に外部APIへ接続しない
- 運用: GitHub `main`と連携したVercel Production。canonical domainは `https://poke-analytics.com/`
- 自動更新: `.github/workflows/update-champions-data.yml` が毎日および手動実行でデータを更新し、検証成功時だけcommitする

ローカル起動、データ更新、基本コマンドはルートの [`README.md`](../README.md)を参照してください。

## 主要機能

| 機能 | Route | 概要 |
|---|---|---|
| パーティー相性チェッカー | `/party-check` | 6匹のパーティーが使用率上位へどのタイプで弱点を突けるか確認する |
| すばやさランキング | `/speed-ranking` | 種族値と代表的な実数値帯を共通スケールで比較する |
| 使用率ランキング | `/usage-ranking` | Singles / Doubles順位と、技・持ち物・努力値配分・性格・特性・同時採用・習得技を表示する |
| ダメージ早見表 | `/damage-chart` | 2匹の代表技による概算ダメージを双方向に比較する |
| 技からポケモン検索 | `/move-search` | Champions learnsetを技から逆引きし、使用率順位と併せて表示する |
| このポケモンってどんなポケモン？ | `/pokemon-intro` | 対戦での基本的な役割をシーズン非依存の言葉で説明する初心者向け図鑑 |
| ポケモン使い方解説 | `/pokemon-guide` | 基本の使い方、相手、味方まで扱う、別系統の初心者向け解説 |
| 役割一覧 | `/pokemon-roles` | 共通role taxonomyを説明し、該当するpokemon-intro記事へつなぐ |

ホームに表示される「技分析」は準備中であり、現在利用可能な機能ではありません。過去に存在した環境推移機能は現在ありません。

## データソースと生成

- **Champions Battle Data**: `Current`、Singles / Doubles順位、battle rows、ポケモン・フォーム、タイプ、種族値、画像などの基礎データ。
- **projectpokemon/champout**: Pokémon Champions専用learnset、フォーム固有の特性、技のタイプ・分類・威力・命中・PP、日本語の技・特性説明、持ち物・性格の日本語名。
- **PokéAPI**: Champions由来データに日本語名や不足する技説明等を補う限定用途。ランキング、使用率、登場ポケモン判定、learnsetの情報源にはしない。

`npm run data:update`は `scripts/update-champions-data.ts` と `scripts/update-usage-ranking-data.ts` を順に実行します。外部データをstagingへ取得・正規化・検証し、成功時のみ `data/`へ公開します。主な出力は次のとおりです。

- `data/champions/`: パーティー相性チェッカーとすばやさランキング向け
- `data/usage-ranking/`: 一覧、各フォーム詳細、技metadata、localization
- `data/metadata.json`: Currentの解決結果、データ期間、更新情報
- `data/moves/`、`data/i18n/`: 共通技情報と日本語名

Championsのbattle dataは「実際の利用状況」、champout learnsetは「覚えられる技の全集合」です。両者を混同しません。現在環境を扱うツールは特定seasonを固定せず、APIの `Current`を基本にします。

## フォームの扱い

- Mega、regional、性別差、Rotom等の独立フォームは、Champions metadataの固有slug / IDと `formRelation`（`base` / `mega` / `independent`）で扱う。
- base speciesとの結び付きにはChampionsのbattle ID・attached formsを使う。
- 名前の接頭辞・単純置換だけでフォームを推測しない。
- 使用率詳細ではbaseページに関連Mega情報を統合する一方、生成データとpokemon-intro制作対象は固有フォームIDを保持する。
- 不完全な外部APIレコードや解決不能なフォームを、推測した値で公開しない。

## UI・実装原則

- mobile-first、日本語UI、コンパクトでdata-denseな表示。
- 既存のtype badge、画像、format toggle、detail sheet等を再利用する。
- 情報追加でカードやページを不必要に縦長にしない。
- 共通データを再利用し、記事や画面ごとに技数値等を重複保存しない。
- 公開機能は静的生成とローカルJSON読み込みを基本とする。

## 関連資料

- 現在地と次作業: [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
- 設計判断と変更禁止事項: [`DECISIONS.md`](DECISIONS.md)
- pokemon-intro執筆規約: [`pokemon-intro-authoring.md`](pokemon-intro-authoring.md)
- pokemon-intro全制作計画: [`pokemon-intro-production-plan.md`](pokemon-intro-production-plan.md)
- 機械可読な制作計画: [`../data/pokemon-intro-production-plan.json`](../data/pokemon-intro-production-plan.json)

