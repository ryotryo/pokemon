# Poké Analytics 現在地

## Last updated

2026-09-20（「ポケモン対戦の基礎」公開後に更新）

## Current focus

初心者向けの学習コンテンツ「ポケモン対戦の基礎」を新設し、完全初心者コース15記事を公開しました。ポケモン個別の理解は「このポケモンってどんなポケモン？」、ルールや用語の理解は「ポケモン対戦の基礎」へ分けて運用します。

## Current state

- パーティー相性チェッカー、すばやさランキング、使用率ランキング、ダメージ早見表、技からポケモン検索、pokemon-intro、役割一覧、ポケモン対戦の基礎を公開中。
- 「ポケモン対戦の基礎」は8カテゴリの共通定義と構造化記事データを使用し、完全初心者コース15記事をreading order 1〜15で公開。各記事は前後移動、関連記事、必要な既存ツールへの導線を持つ。
- pokemon-intro一覧は全国図鑑No.順を初期表示とし、名前・Singles/Doubles順位・すばやさ・種族値合計での並び替え、日本語名検索、タイプ絞り込みに対応。状態はURL queryで復元する。
- pokemon-introの現在Champions対象: **341フォーム**（`data/usage-ranking/index.json`）
- 公開済みpokemon-intro: **341記事**（`content/pokemon-intros.ts`）
- 現在対象の未記事化: **0フォーム**
- 今回の新規追加対象: **2フォーム**（`vivillon-icy-snow-pattern`、`persian`）
- 制作計画: **35 batch**。作成時点の対象に後日追加されたフォームを末尾batchへ追記しているため、計画は履歴スナップショットを含む。
- 完成batch: **batch-01〜batch-11、batch-13〜batch-35**
- 未完成batch: **batch-12（9/10）**。未制作は `vivillon-fancy-pattern` のみで、現行index / detailに存在しないためデータ復帰または計画整理待ち
- 機械判定上の次の未完成batch: **batch-12**。現行Current対象だけに限れば未完成batchなし
- 進捗は `data/pokemon-intro-production-plan.json`と記事IDの比較で判定し、手書きフラグは使わない。

執筆再開前に [`pokemon-intro-authoring.md`](pokemon-intro-authoring.md)を読み、全体計画は [`pokemon-intro-production-plan.md`](pokemon-intro-production-plan.md)、機械判定には [`../data/pokemon-intro-production-plan.json`](../data/pokemon-intro-production-plan.json)を使ってください。

## Latest Champions data

- API指定: **Current**
- 現在の解決ラベル: **M6**
- Champions source生成日時: **2026-09-20T03:33:50.683Z**
- 収録daily data期間: **2026-09-11〜2026-09-20**
- data version: **20260920033350683**
- 現在の生成データ: Singles / Doubles各263 battle records、すばやさ・使用率indexは341フォーム
- champout snapshot: commit `50e7233b78c3b81df29563f9695386c28e77fc95`

これらは `data/metadata.json`と `data/usage-ranking/metadata.json`の現在値です。新しい作業では固定値として信用せず、まず生成済みmetadataを確認してください。

## Next actions

1. 「ポケモン対戦の基礎」の第2弾は、天候・フィールド・HP数値・設置技・サイクル等の優先度を人間レビューしてから制作する。
2. `vivillon-fancy-pattern` が現行Champions対象へ復帰したか確認し、復帰していればbatch-12を完成する。未復帰なら履歴スナップショットとして保留を維持する。
3. 新しいChampions対象が追加された場合はproduction plan末尾へ追記し、未記事化IDだけを制作する。
4. Championsの `Current`更新は自動workflowまたは `npm run data:update`で継続する。

## Important cautions

- 次のbatchを番号だけで決め打ちせず、production planと記事IDから毎回再判定する。
- 廃止済みの旧「ポケモン使い方解説」やホームの公開予定欄を、明確な新方針なしに復活させない。
- PokéAPI learnset、SV、Showdown等をChampionsデータへ混ぜない。
- Mega / regional / independent formを表示名だけで判定しない。
- 不完全なdaily snapshotから環境推移を推測せず、削除済みmeta-historyを復活させない。
- 記事の技数値・一般効果は共通move metadataから解決し、記事側へ重複保存しない。
- 基礎記事は用語辞典だけにせず、仕組みと「対戦で何が変わるか」をつなげる。完全初心者コースのreading orderと内容カテゴリを混同しない。
- 大きな作業は早めにGitHub checkpointを作り、project memory更新だけを理由に安全な実装のpushを遅らせない。
