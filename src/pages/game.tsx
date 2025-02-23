import * as React from 'react'
import { useEffect } from 'react'
import styled from 'styled-components'
import ScoreButton from './scoreButton'

const Header = styled.header`
  background-color: #333;
  color: #fff;
  font-family: 'Arial', sans-serif;
  font-size: 1.5rem;
  height: 14rem;
  left: 0;
  line-height: 2rem;
  padding: 0.5rem 1rem;
  position: fixed;
  right: 0;
  top: 0;
`

const Wrapper = styled.div`
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 3rem;
`
const Score = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  font-size: 10rem;
  height: 10rem;
  margin: 0 auto;
`

const ScoreHistory = styled.div`

`

const ScoreInput = styled.div`

`



export const Editor: React.FC = () => {
  const [score, setScore] = React.useState<number>(101); // スコアを管理
  const [scoreScreen, setScoreScreen] = React.useState<number[]>([]); // スコアを一時的に表示
  const [scoreHistory, setScoreHistory] = React.useState<number[]>([]); // スコアの履歴を管理
  
  // OKボタンが押された時の処理
  // スコア入力の数字をスコアに反映、履歴に追加
  const handleScoreChange = () => {
    scoreScreen.forEach((value) => {
      setScore((prevScore) => prevScore - value);
      setScoreHistory((prevHistory) => [...prevHistory, value]);
    });
    setScoreScreen([]);
  }

  // スコア入力リスト
  // スコアの変更を一時的に表示
  const handleScoreScreen = (buttonValue: number) => {
    if (scoreScreen.length < 3) {
      setScoreScreen((scoreScreenList) => [...scoreScreenList, buttonValue]);
    }
  }

    return (
      <>
        <Header>
          <Score>{score}</Score>
          <ScoreInput>スコア入力：{scoreScreen}</ScoreInput>
          <ScoreHistory>
          スコア履歴：
            {scoreHistory.map((value) => (
              <span>{value}</span>
            ))}
          </ScoreHistory>
        </Header>
        <Wrapper>
          <ScoreButton numClick={(buttonValue) => {
            if(buttonValue === "OK") {
              handleScoreChange();
            } else if (buttonValue === "取り消し") {
              // スコア入力リストから最後にクリックした数字を削除
              setScoreScreen(scoreScreenList => scoreScreenList.slice(0, -1));
            } else {
              handleScoreScreen(buttonValue);
            }
          }} />
        </Wrapper>
      </>
    )
  
  }