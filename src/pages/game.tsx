import * as React from 'react'
import styled from 'styled-components'
import ScoreButton from './scoreButton'
import { Sidebar } from '../components/Sidebar'
import { ScoreDetail, RoundDetail } from '../types'

const GameContainer = styled.div`
  display: flex;
  height: 100vh;
  min-height: 600px; /* Ensure minimum height for usability */
  
  @media (max-width: 768px) {
    flex-direction: column;
    min-height: 100vh; /* Full viewport height on mobile */
  }
  
  @media (max-width: 480px) {
    min-height: 100vh;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Prevent flex item from overflowing */
  
  @media (max-width: 768px) {
    flex: none;
    height: 60vh; /* Give main content 60% of screen height on mobile */
  }
`;

const Header = styled.header`
  background-color: #333;
  color: #fff;
  font-family: 'Arial', sans-serif;
  font-size: 1.5rem;
  height: 14rem;
  line-height: 2rem;
  padding: 0.5rem 1rem;
  
  @media (max-width: 768px) {
    height: 12rem; /* Reduce header height on mobile */
    font-size: 1.2rem; /* Reduce font size */
    padding: 0.5rem; /* Reduce padding */
  }
  
  @media (max-width: 480px) {
    height: 10rem; /* Further reduce on very small screens */
    font-size: 1rem;
  }
`;

const Wrapper = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden; /* Prevent content overflow */
  
  @media (max-width: 768px) {
    overflow-y: auto; /* Allow scrolling on mobile if needed */
  }
`
const Score = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  font-size: 10rem;
  height: 10rem;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    font-size: 6rem; /* Reduce score font size on mobile */
    height: 6rem;
  }
  
  @media (max-width: 480px) {
    font-size: 4rem; /* Further reduce on very small screens */
    height: 4rem;
  }
`

const ScoreInput = styled.div`

`

const ScoreHistory = styled.div`

`


export const Editor: React.FC = () => {
  const [score, setScore] = React.useState<number>(151); // スコアを管理
  const [scoreScreen, setScoreScreen] = React.useState<number[]>([]); // スコアを一時的に表示
  const [scoreHistory, setScoreHistory] = React.useState<number[]>([]); // スコアの履歴を管理
  
  // Multiplier状態の管理
  const [singleButtonActive, setSingleButtonActive] = React.useState<boolean>(true);
  const [doubleButtonActive, setDoubleButtonActive] = React.useState<boolean>(false);
  const [tripleButtonActive, setTripleButtonActive] = React.useState<boolean>(false);

  // ラウンド詳細情報の管理
  const [roundDetails, setRoundDetails] = React.useState<RoundDetail[]>([]);
  const [selectedRoundIndex, setSelectedRoundIndex] = React.useState<number | null>(null);

  // scoreScreenとmultiplier状態からScoreDetail配列を生成する関数
  const generateScoreDetails = (scoreScreen: number[]): ScoreDetail[] => {
    return scoreScreen.map(score => {
      let baseNumber: number;
      let multiplier: 'S' | 'D' | 'T';
      
      // Bull (50点) の場合は常にSingle扱い
      if (score === 50) {
        baseNumber = 50;
        multiplier = 'S';
      } else {
        // 現在のmultiplier状態から逆算してbaseNumberを計算
        if (doubleButtonActive) {
          baseNumber = score / 2;
          multiplier = 'D';
        } else if (tripleButtonActive) {
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

  // ゲームをリセットする関数
  const resetGame = () => {
    setScore(151);
    setScoreScreen([]);
    setScoreHistory([]);
    setRoundDetails([]);
    setSelectedRoundIndex(null);
  };

  // Multiplierボタンの状態を切り替える関数
  const toggleMultiplierState = (value: string) => {
    if (value === "Single" && singleButtonActive === false) {
      setSingleButtonActive(true);
      setDoubleButtonActive(false);
      setTripleButtonActive(false);
    } else if (value === "Double" && doubleButtonActive === false) {
      setDoubleButtonActive(true);
      setSingleButtonActive(false);
      setTripleButtonActive(false);
    } else if (value === "Triple" && tripleButtonActive === false) {
      setTripleButtonActive(true);
      setSingleButtonActive(false);
      setDoubleButtonActive(false);
    }
  };

  // OKボタンが押された時の処理
  // スコア入力の数字をスコアに反映、履歴に追加
  const handleScoreChange = () => {
    let newScore = score;
    const currentRoundScores: number[] = [];

    scoreScreen.forEach((value) => {
      newScore -= value;
      currentRoundScores.push(value);
    });

    // 個別スコアの合計値を計算
    const roundTotal = currentRoundScores.reduce((sum, score) => sum + score, 0);

    // スコアチェックを新しいスコアで実行
    if (newScore === 0) {
      // ラウンド詳細情報を生成
      const scoreDetails = generateScoreDetails(scoreScreen);
      const roundDetail: RoundDetail = {
        roundNumber: roundDetails.length + 1,
        scores: scoreDetails,
        total: roundTotal
      };

      setScore(newScore);
      setScoreHistory((prevHistory) => [...prevHistory, roundTotal]);
      setRoundDetails((prevDetails) => [...prevDetails, roundDetail]);
      setScoreScreen([]);
      setTimeout(() => {
        alert("ナイスアウト！");
        resetGame();
      }, 100);
    } else if (newScore < 0) {
      // マイナスになった場合は直前のスコアに戻す（変更を適用しない）
      // ラウンド詳細情報は保存しない
      setScoreScreen([]);
      setTimeout(() => {
        alert("残念、失敗");
      }, 100);
    } else {
      // 正常な場合のみスコアと履歴、ラウンド詳細を更新
      const scoreDetails = generateScoreDetails(scoreScreen);
      const roundDetail: RoundDetail = {
        roundNumber: roundDetails.length + 1,
        scores: scoreDetails,
        total: roundTotal
      };

      setScore(newScore);
      setScoreHistory((prevHistory) => [...prevHistory, roundTotal]);
      setRoundDetails((prevDetails) => [...prevDetails, roundDetail]);
      setScoreScreen([]);
    }
  }

  // スコア入力リスト
  // スコアの変更を一時的に表示
  const handleScoreScreen = (buttonValue: number) => {
    if (scoreScreen.length < 3) {
      setScoreScreen((scoreScreenList) => [...scoreScreenList, buttonValue]);
    }
  }

  return (
    <GameContainer>
      <MainContent>
        <Header>
          <Score>{score}</Score>
          <ScoreInput>スコア入力：{scoreScreen + " "}</ScoreInput>
          <ScoreHistory>
            スコア履歴：
            {scoreHistory.map((value) => (
              <span>{value + " "}</span>
            ))}
          </ScoreHistory>
        </Header>
        <Wrapper>
          <ScoreButton 
            numClick={(buttonValue) => {
              if (buttonValue === "OK") {
                handleScoreChange();
              } else if (buttonValue === "取り消し") {
                // スコア入力リストから最後にクリックした数字を削除
                setScoreScreen(scoreScreenList => scoreScreenList.slice(0, -1));
              } else {
                handleScoreScreen(buttonValue);
              }
            }}
            singleButtonActive={singleButtonActive}
            doubleButtonActive={doubleButtonActive}
            tripleButtonActive={tripleButtonActive}
            onMultiplierToggle={toggleMultiplierState}
          />
        </Wrapper>
      </MainContent>
      <Sidebar 
        rounds={roundDetails}
        selectedRoundIndex={selectedRoundIndex}
        onRoundSelect={setSelectedRoundIndex}
      />
    </GameContainer>
  )

}