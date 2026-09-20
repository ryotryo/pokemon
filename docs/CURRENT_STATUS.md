# Poké Analytics 現在地

## Last updated

2026-09-20（旧ポケモン使い方解説とホーム予定欄の廃止後に更新）

## Current focus

旧「ポケモン使い方解説」を廃止し、初心者向けポケモン個別コンテンツは「このポケモンってどんなポケモン？」へ一本化しました。現行Champions対象341フォームの記事化は完了済みです。公開ホームには今後の予定を表示せず、開発計画はproject memoryとproduction planで管理します。

## Current state

- パーティー相性チェッカー、すばやさランキング、使用率ランキング、ダメージ早見表、技からポケモン検索、pokemon-intro、役割一覧を公開中。
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
- Champions source生成日時: **2026-09-19T15:00:47.017Z**
- 収録daily data期間: **2026-09-11〜2026-09-19**
- data version: **20260919150047017**
- 現在の生成データ: Singles / Doubles各263 battle records、すばやさ・使用率indexは341フォーム
- champout snapshot: commit `50e7233b78c3b81df29563f9695386c28e77fc95`

これらは `data/metadata.json`と `data/usage-ranking/metadata.json`の現在値です。新しい作業では固定値として信用せず、まず生成済みmetadataを確認してください。

## Next actions

1. `vivillon-fancy-pattern` が現行Champions対象へ復帰したか確認し、復帰していればbatch-12を完成する。未復帰なら履歴スナップショットとして保留を維持する。
2. 各batchを全文監査・検証し、独立したGitHub checkpointとして保存する。
3. batch-12・batch-15・batch-18・batch-20・batch-29・全フォーム完成時点の品質ドリフト監査は完了。今後のデータ追加時にも文章・role・フォーム差を再監査する。
4. 新しいChampions対象が追加された場合はproduction plan末尾へ追記し、未記事化IDだけを制作する。
5. Championsの `Current`更新は自動workflowまたは `npm run data:update`で継続する。

## Important cautions

- 次のbatchを番号だけで決め打ちせず、production planと記事IDから毎回再判定する。
- 廃止済みの旧「ポケモン使い方解説」やホームの公開予定欄を、明確な新方針なしに復活させない。
- PokéAPI learnset、SV、Showdown等をChampionsデータへ混ぜない。
- Mega / regional / independent formを表示名だけで判定しない。
- 不完全なdaily snapshotから環境推移を推測せず、削除済みmeta-historyを復活させない。
- 記事の技数値・一般効果は共通move metadataから解決し、記事側へ重複保存しない。
- 大きな作業は早めにGitHub checkpointを作り、project memory更新だけを理由に安全な実装のpushを遅らせない。
