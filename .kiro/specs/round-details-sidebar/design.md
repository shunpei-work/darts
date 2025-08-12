# Design Document

## Overview

ダーツゲームアプリにサイドバーを追加し、各ラウンドの履歴表示と詳細表示機能を実装します。サイドバーは画面右側に配置し、各ラウンドをクリックすることで、そのラウンドの詳細なスコア（Single、Double、Triple + 数字）を表示できるようにします。

## Architecture

### Current State
- メインゲーム画面：Header（スコア表示、入力、履歴）+ ScoreButton
- データ管理：`scoreHistory`（各ラウンドの合計値）、`scoreScreen`（現在入力中）
- レイアウト：固定ヘッダー + ボタンエリア

### Target State
- メインゲーム画面 + サイドバー（ラウンド一覧 + 詳細表示エリア）
- データ管理：既存データ + 各ラウンドの詳細スコア情報
- レイアウト：固定ヘッダー + サイドバー + ボタンエリア

## Components and Interfaces

### 新規コンポーネント

#### 1. Sidebar Component
```typescript
interface SidebarProps {
  rounds: RoundDetail[];
  selectedRoundIndex: number | null;
  onRoundSelect: (index: number) => void;
}
```

#### 2. RoundList Component
```typescript
interface RoundListProps {
  rounds: RoundDetail[];
  selectedRoundIndex: number | null;
  onRoundSelect: (index: number) => void;
}
```

#### 3. RoundDetail Component
```typescript
interface RoundDetailProps {
  round: RoundDetail | null;
}
```

### データ構造

#### RoundDetail Interface
```typescript
interface RoundDetail {
  roundNumber: number;
  scores: ScoreDetail[];
  total: number;
}

interface ScoreDetail {
  value: number;        // 実際のスコア値（20, 40, 60など）
  baseNumber: number;   // ベース数字（20, 15, 10など）
  multiplier: 'S' | 'D' | 'T';  // Single, Double, Triple
}
```

### 既存コンポーネントの変更

#### Editor Component (src/pages/game.tsx)
**新しいState:**
```typescript
const [roundDetails, setRoundDetails] = React.useState<RoundDetail[]>([]);
const [selectedRoundIndex, setSelectedRoundIndex] = React.useState<number | null>(null);
```

**変更が必要な関数:**
- `handleScoreChange`: ラウンド詳細情報の保存
- `resetGame`: ラウンド詳細とサイドバー状態のリセット

**レイアウト変更:**
- サイドバー用のスペース確保
- メインコンテンツエリアの幅調整

#### ScoreButton Component
**変更なし** - 既存の機能をそのまま利用

## Data Models

### 現在のデータフロー
```
スコア入力 → scoreScreen → handleScoreChange → scoreHistory更新
```

### 新しいデータフロー
```
スコア入力 → scoreScreen → handleScoreChange → {
  scoreHistory更新（既存）
  roundDetails更新（新規）
}
```

### スコア詳細情報の生成ロジック
```typescript
// scoreScreenから詳細情報を生成
const generateScoreDetails = (scoreScreen: number[], activeMultiplier: string): ScoreDetail[] => {
  return scoreScreen.map(score => {
    // 現在のmultiplier状態から逆算してbaseNumberを計算
    let baseNumber: number;
    let multiplier: 'S' | 'D' | 'T';
    
    if (score === 50) {
      baseNumber = 50;
      multiplier = 'S';
    } else {
      // Double/Tripleの場合は逆算
      if (activeMultiplier === 'D') {
        baseNumber = score / 2;
        multiplier = 'D';
      } else if (activeMultiplier === 'T') {
        baseNumber = score / 3;
        multiplier = 'T';
      } else {
        baseNumber = score;
        multiplier = 'S';
      }
    }
    
    return {
      value: score,
      baseNumber,
      multiplier
    };
  });
};
```

## Error Handling

### エラーケース
1. **空のラウンド選択**: 詳細表示エリアに「ラウンドを選択してください」を表示
2. **無効なラウンドインデックス**: 選択状態をリセット
3. **データ不整合**: roundDetailsとscoreHistoryの長さが異なる場合の処理

### 新しいエラーケース
- **サイドバー表示エラー**: レスポンシブ対応での表示崩れ
- **詳細情報生成エラー**: multiplier状態の取得失敗

## Testing Strategy

### Unit Tests
1. **RoundDetail生成テスト**
   - Single: [20] → {value: 20, baseNumber: 20, multiplier: 'S'}
   - Double: [40] → {value: 40, baseNumber: 20, multiplier: 'D'}
   - Triple: [60] → {value: 60, baseNumber: 20, multiplier: 'T'}

2. **サイドバー表示テスト**
   - ラウンド一覧の正しい表示
   - 選択状態の管理
   - 詳細表示の切り替え

3. **レスポンシブテスト**
   - 小画面でのサイドバー表示
   - メインコンテンツとのレイアウトバランス

### Integration Tests
1. **ゲームフローテスト**
   - スコア入力 → OK → サイドバー更新の一連の流れ
   - ラウンド選択 → 詳細表示の動作
   - リセット時のサイドバークリア

### Manual Tests
1. **UI/UX確認**
   - サイドバーの使いやすさ
   - 既存機能への影響確認
   - レスポンシブ動作確認

## Implementation Notes

### レイアウト設計
```css
.game-container {
  display: flex;
  height: 100vh;
}

.main-content {
  flex: 1;
  /* 既存のゲーム画面 */
}

.sidebar {
  width: 300px;
  background: #f5f5f5;
  border-left: 1px solid #ddd;
  display: flex;
  flex-direction: column;
}

.round-list {
  flex: 1;
  overflow-y: auto;
}

.round-detail {
  height: 200px;
  border-top: 1px solid #ddd;
  padding: 1rem;
}
```

### Multiplier状態の取得
ScoreButtonコンポーネントから現在のmultiplier状態を取得する必要があります。これは以下の方法で実現：

1. **Props経由での状態共有**
2. **Context APIの使用**
3. **State Lifting（推奨）**

推奨アプローチ：ScoreButtonのmultiplier状態をEditorコンポーネントに移動し、propsで渡す方式。