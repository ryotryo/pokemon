# Poké Analytics 現在地

## Last updated

2026-09-22（公開UIの共通タイプ画像統一後に更新）

## Current focus

Pokémon、Pokémon mini、タイプ、持ち物のChampions Battle Data画像を、安全に解決・表示・フォールバックできる共通asset基盤を導入しました。公開UIでポケモンまたは技の具体的なタイプを示す箇所は、共通`TypeBadge`によるタイプ画像＋日本語名へ統一しています。

## Current state

- パーティー相性チェッカー、すばやさランキング、使用率ランキング、ダメージ早見表、技からポケモン検索、pokemon-intro、役割一覧、ポケモン対戦の基礎を公開中。
- 「ポケモン対戦の基礎」は8カテゴリの共通定義と構造化記事データを使用し、計45記事を公開。全記事にreading order 1〜45を設定し、一覧の番号付きコースとテーマ別カテゴリの両方からアクセスできる。
- 全45記事と8カテゴリはstable icon IDを持ち、一覧・記事見出し・関連記事で共通のインラインSVGアイコンを表示。記事本文のConcept Diagramは表示しない。
- 使用率詳細の持ち物TOP10へ持ち物画像、使用率・pokemon-intro・技検索・役割一覧の小型表示へPokémon miniを導入。usage-ranking、party-check、damage、move-search、pokemon-introのポケモン・技・弱点・耐性のタイプUIは共通タイプ画像を表示する。
- native `select`内のtype filterは、選択肢へ画像を安定表示できないブラウザ仕様とモバイル操作性のため日本語テキストを維持する。トップ、speed-ranking、pokemon-rolesには現状タイプを列挙するUIがない。
- 「持ち物ってなに？」には、こだわりスカーフ・きあいのタスキ・たべのこしの実画像例をコンパクトに表示する。
- カテゴリ別記事数: まず知っておきたいこと5、ダメージ8、素早さ6、状態異常・能力変化7、場の効果7、HPと数値3、パーティーと考え方6、対戦用語3。
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

1. 「ポケモン対戦の基礎」の次の記事群は、既存45記事の利用状況と人間レビューを確認してから優先度を決める。
2. `vivillon-fancy-pattern` が現行Champions対象へ復帰したか確認し、復帰していればbatch-12を完成する。未復帰なら履歴スナップショットとして保留を維持する。
3. 新しいChampions対象が追加された場合はproduction plan末尾へ追記し、未記事化IDだけを制作する。
4. Championsの `Current`更新は自動workflowまたは `npm run data:update`で継続する。
5. 次の画像展開候補は、party-checkとspeed-ranking内の直接`img`、damage toolの持ち物表示。共通componentへ段階的に移し、一覧全体の一括変更は避ける。

## Important cautions

- 次のbatchを番号だけで決め打ちせず、production planと記事IDから毎回再判定する。
- 廃止済みの旧「ポケモン使い方解説」やホームの公開予定欄を、明確な新方針なしに復活させない。
- PokéAPI learnset、SV、Showdown等をChampionsデータへ混ぜない。
- Mega / regional / independent formを表示名だけで判定しない。
- 不完全なdaily snapshotから環境推移を推測せず、削除済みmeta-historyを復活させない。
- 記事の技数値・一般効果は共通move metadataから解決し、記事側へ重複保存しない。
- 基礎記事は用語辞典だけにせず、仕組みと「対戦で何が変わるか」をつなげる。完全初心者コースのreading orderと内容カテゴリを混同しない。
- 本文だけで内容が完結する状態を保つ。図を追加する場合は、本文より理解しやすくなることを個別に確認し、色だけで意味を伝えない。
- 大きな作業は早めにGitHub checkpointを作り、project memory更新だけを理由に安全な実装のpushを遅らせない。
