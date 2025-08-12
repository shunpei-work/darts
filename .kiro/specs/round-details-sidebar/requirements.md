# Requirements Document

## Introduction

現在のダーツゲームアプリにサイドバーを追加し、各ラウンドの履歴を表示する機能を実装します。ユーザーは各ラウンドをクリックすることで、そのラウンドの詳細なスコア（Single、Double、Triple と数字の組み合わせ）を確認できるようになります。

## Requirements

### Requirement 1

**User Story:** As a ダーツプレイヤー, I want サイドバーで各ラウンドの一覧を見る, so that 過去のラウンドを簡単に確認できる

#### Acceptance Criteria

1. WHEN ゲーム画面が表示される THEN システム SHALL サイドバーを画面の左側または右側に表示する
2. WHEN ラウンドが完了する THEN システム SHALL サイドバーに新しいラウンドエントリを追加する
3. WHEN サイドバーが表示される THEN システム SHALL 各ラウンドを「ラウンド 1」「ラウンド 2」の形式で表示する
4. WHEN 複数のラウンドが存在する THEN システム SHALL ラウンドを時系列順（最新が下）で表示する

### Requirement 2

**User Story:** As a ダーツプレイヤー, I want ラウンドをクリックして詳細を見る, so that そのラウンドで投げた具体的なスコアを確認できる

#### Acceptance Criteria

1. WHEN ユーザーがサイドバーのラウンドをクリックする THEN システム SHALL そのラウンドの詳細情報を表示する
2. WHEN ラウンド詳細が表示される THEN システム SHALL Single、Double、Tripleの種別と数字を表示する
3. WHEN ラウンド詳細が表示される THEN システム SHALL そのラウンドの合計スコアを表示する
4. WHEN ユーザーが別のラウンドをクリックする THEN システム SHALL 新しいラウンドの詳細に切り替える

### Requirement 3

**User Story:** As a ダーツプレイヤー, I want スコア詳細の表示形式が分かりやすい, so that 投げた内容を正確に把握できる

#### Acceptance Criteria

1. WHEN スコア詳細が表示される THEN システム SHALL Singleを「S20」、Doubleを「D20」、Tripleを「T20」の形式で表示する
2. WHEN 3投のスコアが表示される THEN システム SHALL 各投を順番に表示する
3. WHEN ラウンドの合計スコアが表示される THEN システム SHALL 「合計: XX点」の形式で表示する
4. WHEN 詳細表示エリアが空の状態 THEN システム SHALL 「ラウンドを選択してください」のメッセージを表示する

### Requirement 4

**User Story:** As a ダーツプレイヤー, I want ゲームリセット時にサイドバーもクリアされる, so that 新しいゲームを開始できる

#### Acceptance Criteria

1. WHEN ゲームがリセットされる THEN システム SHALL サイドバーのラウンド一覧をクリアする
2. WHEN ナイスアウト後にゲームがリセットされる THEN システム SHALL ラウンド詳細表示エリアをクリアする
3. WHEN リセット後 THEN システム SHALL 「ラウンドを選択してください」のメッセージを表示する

### Requirement 5

**User Story:** As a ダーツプレイヤー, I want サイドバーが既存のゲーム画面を邪魔しない, so that 快適にゲームを続けられる

#### Acceptance Criteria

1. WHEN サイドバーが表示される THEN システム SHALL メインゲーム画面の操作性を維持する
2. WHEN サイドバーが表示される THEN システム SHALL スコアボタンの配置や大きさに影響を与えない
3. WHEN 画面サイズが小さい THEN システム SHALL サイドバーを適切にレスポンシブ対応する
4. WHEN サイドバーが表示される THEN システム SHALL 全体のレイアウトバランスを保つ