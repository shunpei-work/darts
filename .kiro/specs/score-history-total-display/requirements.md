# Requirements Document

## Introduction

現在のダーツゲームアプリでは、スコア履歴に投げた個別のスコアが全て表示されています（例：「20 15 10 25」）。この機能では、スコア履歴の表示を個別スコアの合計値のみに変更し、より簡潔で見やすい履歴表示を実現します。

## Requirements

### Requirement 1

**User Story:** As a ダーツプレイヤー, I want スコア履歴に合計値のみが表示される, so that 履歴がより簡潔で見やすくなる

#### Acceptance Criteria

1. WHEN プレイヤーがOKボタンを押してスコアを確定する THEN システム SHALL スコア履歴に個別スコアの合計値のみを追加する
2. WHEN スコア履歴が表示される THEN システム SHALL 各ラウンドの合計値のみを表示する
3. WHEN 複数のラウンドが完了している THEN システム SHALL 各ラウンドの合計値をスペース区切りで表示する

### Requirement 2

**User Story:** As a ダーツプレイヤー, I want 現在の入力中のスコアは個別に表示される, so that 入力内容を確認できる

#### Acceptance Criteria

1. WHEN プレイヤーがスコアボタンを押している THEN システム SHALL スコア入力エリアに個別のスコアを表示する
2. WHEN プレイヤーがOKボタンを押す前 THEN システム SHALL スコア入力エリアの表示を維持する
3. WHEN プレイヤーがOKボタンを押した後 THEN システム SHALL スコア入力エリアをクリアする

### Requirement 3

**User Story:** As a ダーツプレイヤー, I want ゲームリセット時に履歴もクリアされる, so that 新しいゲームを開始できる

#### Acceptance Criteria

1. WHEN ゲームがリセットされる THEN システム SHALL スコア履歴をクリアする
2. WHEN ナイスアウト後にゲームがリセットされる THEN システム SHALL スコア履歴を空の状態にする

### Requirement 4

**User Story:** As a ダーツプレイヤー, I want 履歴表示が既存のUIレイアウトを維持する, so that 使い慣れたインターフェースを継続して使用できる

#### Acceptance Criteria

1. WHEN スコア履歴が表示される THEN システム SHALL 既存のヘッダー内の位置に表示する
2. WHEN スコア履歴が表示される THEN システム SHALL 「スコア履歴：」のラベルを維持する
3. WHEN スコア履歴の表示形式が変更される THEN システム SHALL 他のUI要素のレイアウトに影響を与えない