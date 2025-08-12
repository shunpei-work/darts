# Design Document

## Overview

この機能では、ダーツゲームアプリのスコア履歴表示を個別スコアから合計値のみの表示に変更します。現在の実装では`scoreHistory`配列に個別のスコアを全て保存していますが、これを各ラウンドの合計値のみを保存する形に変更します。

## Architecture

### Current State
- `scoreHistory: number[]` - 個別スコアを全て保存
- 履歴表示: 全ての個別スコアを順次表示

### Target State
- `scoreHistory: number[]` - 各ラウンドの合計値のみを保存
- 履歴表示: 各ラウンドの合計値のみを表示

## Components and Interfaces

### 影響を受けるコンポーネント

#### 1. Editor Component (src/pages/game.tsx)
- **State変更**: `scoreHistory`の保存形式を変更
- **Logic変更**: `handleScoreChange`関数内でのスコア履歴更新ロジック
- **Display変更**: スコア履歴の表示ロジック

#### 2. ScoreButton Component (src/pages/scoreButton.tsx)
- **変更なし**: このコンポーネントは影響を受けない

### データフロー

```
スコア入力 → OK押下 → handleScoreChange → 合計値計算 → scoreHistory更新 → 表示更新
```

## Data Models

### 現在のデータ構造
```typescript
scoreScreen: number[]     // 現在入力中のスコア [20, 15, 10]
scoreHistory: number[]    // 全ての個別スコア [20, 15, 10, 25, 30, 5]
```

### 新しいデータ構造
```typescript
scoreScreen: number[]     // 現在入力中のスコア [20, 15, 10] (変更なし)
scoreHistory: number[]    // 各ラウンドの合計値 [45, 60] (45 = 20+15+10, 60 = 25+30+5)
```

### 変更が必要な関数

#### handleScoreChange関数
**現在の実装:**
```typescript
setScoreHistory((prevHistory) => [...prevHistory, ...currentRoundScores]);
```

**新しい実装:**
```typescript
const roundTotal = currentRoundScores.reduce((sum, score) => sum + score, 0);
setScoreHistory((prevHistory) => [...prevHistory, roundTotal]);
```

#### 履歴表示ロジック
**現在の実装:**
```jsx
{scoreHistory.map((value) => (
  <span>{value + " "}</span>
))}
```

**新しい実装:** (変更なし - 既に合計値のみが配列に入るため)

## Error Handling

### エラーケース
1. **空のscoreScreen**: 現在の実装で既に適切に処理されている
2. **マイナススコア**: 現在の実装で既に適切に処理されている
3. **ナイスアウト**: 現在の実装で既に適切に処理されている

### 新しいエラーケース
- **合計値計算エラー**: `reduce`関数が適切に動作することを確認

## Testing Strategy

### Unit Tests
1. **合計値計算テスト**
   - 単一スコアの場合: [20] → 20
   - 複数スコアの場合: [20, 15, 10] → 45
   - 空配列の場合: [] → 0

2. **履歴更新テスト**
   - 新しいラウンド追加時の履歴状態確認
   - 複数ラウンド後の履歴状態確認

3. **表示テスト**
   - 履歴表示が合計値のみになることを確認
   - 複数ラウンドの表示形式確認

### Integration Tests
1. **ゲームフローテスト**
   - スコア入力 → OK → 履歴更新の一連の流れ
   - ナイスアウト時のリセット動作
   - 失敗時の履歴非更新確認

### Manual Tests
1. **UI確認**
   - 履歴表示の見た目確認
   - レイアウトの崩れがないことを確認
   - 既存機能への影響がないことを確認