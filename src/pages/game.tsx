import * as React from 'react'
import { useEffect } from 'react'
import styled from 'styled-components'
import ScoreButton from './scoreButton'

const Header = styled.header`
  font-size: 1.5rem;
  height: 2rem;
  left: 0;
  line-height: 2rem;
  padding: 0.5rem 1rem;
  position: fixed;
  right: 0;
  top: 0;
`

const MainScore = styled.div`

`

const Wrapper = styled.div`
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 3rem;
`
const ScoreHistory = styled.div`

`



export const Editor: React.FC = () => {
  const [score, setScore] = React.useState<number>(101); // スコアを管理
  const [scoreHistory, setScoreHistory] = React.useState<number[]>([]); // スコアの履歴を管理

  // スコアの変更を処理
  const handleScoreChange = (buttonValue: number) => {
    setScore((prevScore) => prevScore - buttonValue);
    setScoreHistory((prevHistory) => [...prevHistory, buttonValue]);
  }

    return (
      <>
        <Header>
          スコア：{score}
          <ScoreHistory>スコア履歴：
            {scoreHistory.map((value) => (
              <span>{value}</span>
            ))}
          </ScoreHistory>
        </Header>
        <Wrapper>
          <ScoreButton numClick={handleScoreChange} />
        </Wrapper>
      </>
    )
  
  }