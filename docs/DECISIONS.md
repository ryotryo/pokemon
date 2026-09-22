# Poké Analytics 重要設計判断

この文書は変更履歴ではなく、将来の作業で必要になる「なぜ」と、その判断から生じるルールを記録します。個々の実装履歴はgit historyを参照してください。

## 2026-07-19: Pokémon Champions専用サイトとする

**Decision:** 対戦データとツールの対象をPokémon Championsに限定する。

**Reason:** 作品ごとに登場ポケモン、技、特性、仕様が異なり、SVやShowdown等のデータを混ぜると利用者へ誤情報を示すため。

**Consequence:** 他作品のランキング・learnset・対戦仕様をChampionsデータの代用にしない。補助ソースを使う場合も、Championsに存在する対象の表示補助へ限定する。

## 2026-07-27: 閲覧時は生成済み静的JSONを使用する

**Decision:** 外部データは更新処理で取得・検証し、公開画面はリポジトリ内の静的JSONを読む。

**Reason:** 外部APIの停止や応答速度に公開サイトの閲覧を依存させず、同じcommitから再現可能な表示を作るため。

**Consequence:** データ更新はstagingで完了させ、検証成功時だけ公開JSONを置換する。UIから外部APIを直接呼ぶ設計へ安易に変更しない。

## 2026-08-02: learnsetはChampions/champoutを正とする

**Decision:** 習得技、フォーム固有特性、技の基礎数値はprojectpokemon/champoutのPokémon Championsデータを使用する。PokéAPI learnsetは使用しない。

**Reason:** Poké AnalyticsはChampions専用であり、他作品のlearnsetを混ぜると存在しない技を検索結果・記事・計算へ含めるため。

**Consequence:** 技検索やpokemon-introを含む新機能でも、learnsetをPokéAPIへ切り替えない。PokéAPIはChampions由来の対象に対する日本語名や不足説明等の補助に限る。

## 2026-08-28: 現在環境のツールは `Current`を追従する

**Decision:** 使用率等の現在環境を見る機能は、可能な限りChampions APIの `Current`を利用し、表示用seasonをmetadataから解決する。

**Reason:** season名をコードへ固定すると、切り替わるたびに更新漏れや古いランキングの表示が発生するため。

**Consequence:** 新しいseasonコードを推測・固定しない。`defaultSeason`、利用可能season、battle / daily folderを読み、未知のseason名でも動く汎用処理を維持する。

## 2026-08-14: フォームをmetadataとunique IDで扱う

**Decision:** Mega、regional、Rotom、性別差等をChampions metadataの固有ID、form kind、battle ID、`formRelation`で正規化する。

**Reason:** 名前の文字列変換だけでは通常形との混同、別フォームの統合、将来追加されるフォームの欠落が起きるため。

**Consequence:** フォーム判定を表示名だけで実装しない。各フォームのタイプ・種族値・特性・learnsetを固有IDで検証し、不完全なAPI placeholderへ値を推測しない。

## 2026-08-28: 環境推移機能を削除した状態を維持する

**Decision:** 以前のmeta-history / 環境推移機能を削除した。

**Reason:** daily snapshotが不完全で、欠損を含む時系列から順位推移を正確に示せなかったため。

**Consequence:** 新シーズン更新や別機能の改修に便乗して復活させない。再導入には、欠損を扱える信頼可能な履歴データと新たな設計判断が必要。

## 2026-09-13: pokemon-introは初心者向け・シーズン非依存にする

**Decision:** 「このポケモンってどんなポケモン？」は、対戦で何をするかを理解する入門記事とし、育成論や環境レポートにしない。

**Reason:** 努力値テンプレ、採用率、現在順位、特定seasonの流行を中心にすると、初心者が役割をつかみにくく、season変更で文章が陳腐化するため。

**Consequence:** 本文は役割、強み、代表技、特徴、苦手、要約を平易に説明する。詳細ルールは [`pokemon-intro-authoring.md`](pokemon-intro-authoring.md)を正とする。

## 2026-09-20: 旧ポケモン使い方解説と公開予定欄を廃止する

**Decision:** 旧「ポケモン使い方解説」を廃止し、初心者向けポケモン個別コンテンツは「このポケモンってどんなポケモン？」を継続する。トップページには「今後の予定」を公開しない。

**Reason:** 似た目的の個別コンテンツを並存させず、現在制作・運用する入門図鑑へ利用者の導線を集約するため。開発予定は公開情報ではなく、リポジトリ内で管理するため。

**Consequence:** `/pokemon-guide`と専用記事データを復活させない。開発計画はproject memoryとpokemon-intro production planで管理し、ホームへ予定欄を再設置しない。

## 2026-09-13: role tagは共通定義から選ぶ

**Decision:** pokemon-introのroleは `content/pokemon-roles.ts`の共通definitionsから選ぶ。

**Reason:** 記事ごとの自由入力では同じ役割に別名が増え、役割一覧と記事の対応が壊れるため。

**Consequence:** 記事内だけで新しいrole IDを作らない。taxonomy追加が必要なら、定義・説明・一覧表示・testsへの影響をまとめて検討する。

## 2026-09-13: pokemon-introをproduction planと記事IDで進行管理する

**Decision:** 全対象を `data/pokemon-intro-production-plan.json`で管理し、原則10匹ずつ制作する。進捗は手書きフラグではなく `content/pokemon-intros.ts`の実在IDとの比較で算出する。

**Reason:** 長期制作で対象漏れ、フォーム混同、会話にしか残らない進捗を防ぐため。

**Consequence:** 次batchを番号で決め打ちせず機械判定する。既存batchを並べ替えず、新しいChampions対象は計画末尾へ追加する。約30記事時点では量産を止め、人間が文章・role・読みやすさ・フォーム差をレビューする。

## 2026-09-20: 初心者向け基礎知識をコースとカテゴリで構造化する

**Decision:** 初心者向け基礎知識を「ポケモン対戦の基礎」として構造化し、用語辞典だけではなく、順番に学べる初心者コースとテーマ別カテゴリの両方から読める記事群として運用する。

**Reason:** 完全初心者は学ぶ順番が分からない一方、特定の言葉だけ調べたい利用者もいるため。reading orderと内容分類を分けることで、同じ記事を両方の読み方へ提供できる。

**Consequence:** 記事は構造化データと共通テンプレートで管理し、記事ごとの独立React pageを増やさない。カテゴリはstable IDの共通定義を参照し、初心者コース順とは別フィールドで管理する。本文は仕組みだけで終わらせず、対戦で何が変わるかまで説明する。

## 2026-09-21: 軽量SVGアイコンを共通ビジュアル言語にし、Concept Diagramは撤去する

**Decision:** Poké Analyticsの小アイコンはstable IDを解決する型安全な`SiteIcon`を共通利用する。一方、「ポケモン対戦の基礎」へ試験導入したConcept Diagramは、文章より理解しにくいというレビューを受けて全撤去する。今後の説明図は共通部品の一括適用を前提にせず、本文より明確に理解しやすくなる場合だけ個別に検討する。

**Reason:** SiteIconはOS依存emojiや画面ごとの独自記号を避けながら記事の識別を助ける。一方、Concept Diagramは情報の重複と視覚的なノイズが増え、仕組みの理解を助けるという目的を満たさなかったため。

**Consequence:** 24×24、`currentColor`、統一strokeのインラインSVGを基本とし、タイトル文字列からアイコンを推測しない。記事・カテゴリは明示的なicon IDを持つ。Concept Diagram用のデータ、コンポーネント、テストは削除し、過去に図が扱っていた数値・順序・具体例が本文内に残ることをテストする。アイコンのためだけにclient componentや外部ライブラリ、個別network requestを増やさない。

## 2026-09-21: ゲーム内の具体物は共通Champions asset基盤から表示する

**Decision:** ポケモン、Pokémon mini、タイプ、持ち物は、利用可能かつ利用条件を満たす場合にChampions Battle Dataの静的画像を使う。抽象概念は`SiteIcon`、説明関係は必要性を個別確認したHTML/CSS/SVGとする。URL、canonical名、通常画像からminiへの切り替え、fallbackは共通resolver/componentへ集約する。

**Reason:** 画面ごとのURL組み立てや名前推測は、Megaの二重付加、regional・性別フォームの取り違え、broken image、表記ずれを起こしやすいため。Champions Battle Dataは外部利用とCORSを案内しているが、公開利用には明確なattributionを求めているため。

**Consequence:** ポケモンfilenameはChampions metadataの`image_path`から抽出し、表示名からフォーム名を生成しない。持ち物はchampoutの英語canonical名manifestを生成して日本語名と結び、巨大な手書き翻訳表を作らない。公開UIで具体的なポケモンまたは技のタイプを表す場合は、原則として共通`TypeBadge`からChampions type assetと日本語名を併記する。本文中の通常文章と、画像を安定表示できないnative `select`の選択肢は画像化しない。画像失敗時はminiから通常画像、または既存placeholder・テキストへフォールバックする。存在確認用の大量HEAD requestは行わない。画像は名称やタイプ名を置き換えず、出典リンクを公開ページに表示する。

## 2026-09-13: 技metadataを記事へ重複保存しない

**Decision:** pokemon-introは技IDとそのポケモンでの用途だけを持ち、タイプ・分類・威力・命中・技説明は共通move metadataから解決する。

**Reason:** 技変更時に多数の記事を手修正する構造を避け、他ツールと表示内容を一致させるため。

**Consequence:** 記事へ技数値や一般効果を手書きしない。featured moveがそのフォームのChampions learnsetとmove metadataで解決することをtestする。

## 2026-09-13: 大きなAI作業ではGitHub checkpointを早めに作る

**Decision:** まとまった実装がbuild可能で最低限検証済みになったら、最終監査前でもGitHubへcheckpointを保存できる運用にする。

**Reason:** 大規模Codex作業で、実装・tests・ローカルcommitまで完成した変更が、GitHub反映前の会話長上限／セッション終了により失われたことがあるため。

**Consequence:** 全作業が終わるまで最初のpushを待たない。追加監査・追加tests・文章修正は後続commitでよい。`gh`不在だけで中止せず、通常pushまたは接続済みGitHubアプリを使い、リモート上のcommitを確認する。
