# Poké Analytics: AI作業ガイド

このリポジトリは、Pokémon Champions専用の対戦データ分析・初心者支援サイト「Poké Analytics」です。GitHub `main`をコードとプロジェクト記憶のsource of truthとして扱います。

## 最初に読む順番

1. この `AGENTS.md`
2. [`docs/PROJECT_CONTEXT.md`](docs/PROJECT_CONTEXT.md)
3. [`docs/CURRENT_STATUS.md`](docs/CURRENT_STATUS.md)
4. [`docs/DECISIONS.md`](docs/DECISIONS.md) の関連項目
5. 作業対象固有のdocs
6. 実際の関連コードとtests

全docsを毎回通読する必要はありません。`PROJECT_CONTEXT`と`CURRENT_STATUS`から必要な資料へ進んでください。

## 作業ルール

- 作業開始時に最新のGitHub `main`を取得し、ローカル差分を確認する。
- 現在地は `CURRENT_STATUS.md`、設計理由と変更禁止事項は `DECISIONS.md`で確認する。
- コード変更前に既存実装、生成データ、testsを確認し、推測で仕様を変えない。
- 情報の優先順位は、原則「現在の実データ・外部API → 現在のコードとtests → 同期済みGitHub `main` → project docs → 過去チャット」。ただし設計意図は `DECISIONS.md`も必ず確認する。明確な矛盾は原因を調査してから直す。
- Pokémon Championsのデータと他作品のデータを混ぜない。フォームを名前文字列だけで判定しない。
- project memoryに秘密情報、認証情報、個人情報、会話ログ全文を保存しない。開発資料を公開サイトのrouteやナビゲーションへ追加しない。
- 大きな作業は、まとまった実装がbuild可能かつ最低限検証済みになった時点でGitHubへcheckpointを作る。全監査の完了まで最初のpushを遅らせない。
- `gh`がないことだけをpush不能の理由にしない。通常の `git push`を使い、HTTPS認証等で失敗した場合は接続済みGitHubアプリ経由で反映する。push後はGitHub上のcommit、`main` / `origin/main`同期、cleanなworking treeを確認する。

## 新しいチャットから再開する手順

1. 最新のGitHub `main`を取得する。
2. 上記の順番で入口・概要・現在地・関連decision・対象docsを読む。
3. 関連コード、生成データ、testsで記載内容を検証する。
4. docsと実装が食い違う場合は、実データとgit historyを調査し、必要ならdocsを更新する。
5. 作業範囲と完了条件を確認して開始する。

## 作業終了時のmemory更新

- `CURRENT_STATUS.md`: 主要機能完成、batch進行、次作業や作業フェーズの変更、Championsデータ更新時。
- `DECISIONS.md`: 新しい設計方針、既存方針の変更、将来「なぜ」が必要になる判断時。
- `PROJECT_CONTEXT.md`: 主要機能、データソース、アーキテクチャの大きな変更時。
- 小さなCSS修正、単純なバグ修正、一時調査では原則更新しない。

大きな作業の基本順序は「実装 → tests → GitHub checkpoint → 追加監査・必要なmemory更新」です。memory更新のために安全なコードのcheckpointを遅らせないでください。

