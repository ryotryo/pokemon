# Poké Analytics 現在地

## Last updated

2026-09-13（GitHub `main`の実データから再集計）

## Current focus

「このポケモンってどんなポケモン？」の連続batch制作を進行中です。batch-03までGitHubへcheckpoint済みで、次はbatch-04から再開します。各batchを個別に監査・検証・pushしてから次へ進む方針です。

## Current state

- パーティー相性チェッカー、すばやさランキング、使用率ランキング、ダメージ早見表、技からポケモン検索、pokemon-intro、ポケモン使い方解説、役割一覧を公開中。
- pokemon-introの現在Champions対象: **339フォーム**（`data/usage-ranking/index.json`）
- 公開済みpokemon-intro: **40記事**（`content/pokemon-intros.ts`）
- 現在対象の未記事化: **299フォーム**
- 制作計画: **34 batch**。作成時点の対象に後日追加されたフォームを末尾batchへ追記しているため、計画は履歴スナップショットを含む。
- 完成batch: **batch-01〜batch-03**
- 次の未完成batch: **batch-04（0/10）**
- 進捗は `data/pokemon-intro-production-plan.json`と記事IDの比較で判定し、手書きフラグは使わない。

執筆再開前に [`pokemon-intro-authoring.md`](pokemon-intro-authoring.md)を読み、全体計画は [`pokemon-intro-production-plan.md`](pokemon-intro-production-plan.md)、機械判定には [`../data/pokemon-intro-production-plan.json`](../data/pokemon-intro-production-plan.json)を使ってください。

## Latest Champions data

- API指定: **Current**
- 現在の解決ラベル: **M6**
- Champions source生成日時: **2026-09-12T23:26:03.968Z**
- 収録daily data期間: **2026-09-11〜2026-09-13**
- data version: **20260912232603968**
- 現在の生成データ: Singles / Doubles各259 battle records、すばやさ・使用率indexは339フォーム
- champout snapshot: commit `50e7233b78c3b81df29563f9695386c28e77fc95`

これらは `data/metadata.json`と `data/usage-ranking/metadata.json`の現在値です。新しい作業では固定値として信用せず、まず生成済みmetadataを確認してください。

## Next actions

1. production planと記事IDを再照合し、batch-04から記事制作を再開する。
2. 各batchを全文監査・検証し、独立したGitHub checkpointとして保存する。
3. batch-07完了時（今回の連続制作5batch地点）に品質ドリフト監査とフル検証を行う。
4. batch-12まで完了したらCURRENT_STATUSを再更新し、最終フル検証とVercel Production確認を行う。
5. Championsの `Current`更新は自動workflowまたは `npm run data:update`で継続する。

## Important cautions

- 次のbatchを番号だけで決め打ちせず、production planと記事IDから毎回再判定する。
- 既存の「ポケモン使い方解説」をpokemon-introへ統合・削除しない。
- PokéAPI learnset、SV、Showdown等をChampionsデータへ混ぜない。
- Mega / regional / independent formを表示名だけで判定しない。
- 不完全なdaily snapshotから環境推移を推測せず、削除済みmeta-historyを復活させない。
- 記事の技数値・一般効果は共通move metadataから解決し、記事側へ重複保存しない。
- 大きな作業は早めにGitHub checkpointを作り、project memory更新だけを理由に安全な実装のpushを遅らせない。
