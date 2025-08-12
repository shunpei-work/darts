import * as React from 'react'
import styled from 'styled-components'
import { useState } from "react";

interface ScoreButtonProps {
    numClick: (value) => void;
  }
  
// スコアボタンのコンポーネントを定義
// 数字をクリック、OKをクリックで「スコア入力」に値を追加
const ScoreButton: React.FC<ScoreButtonProps> = ({ numClick }) => {
    // 数値リストを定義
    const numbers = [...Array(20).keys()].map((num) => num + 1).concat(50);
    // スコアエリアボタンの状態を管理
    const [singleButtonActive, setSingleButtonActive] = useState(true);
    const [doubleButtonActive, setDoubleButtonActive] = useState(false);
    const [tripleButtonActive, setTripleButtonActive] = useState(false);

    // スコアエリアボタンの押下時の処理
    const toggleButtonState = (value) => {
      if (value === "Single" && singleButtonActive === false) {
        setSingleButtonActive((activeState) => !activeState);
        setDoubleButtonActive(false);
        setTripleButtonActive(false);
      } else if (value === "Double" && doubleButtonActive === false) {
        setDoubleButtonActive((activeState) => !activeState);
        setSingleButtonActive(false);
        setTripleButtonActive(false);
      } else if (value === "Triple" && tripleButtonActive === false) {
        setTripleButtonActive((activeState) => !activeState);
        setSingleButtonActive(false);
        setDoubleButtonActive(false);
      }
    };
  
    return (
      <Container>
        {numbers.map((number) => (
          <StyledButton 
          key={number} 
          onClick={() => {
            // スコアエリアボタンの状態に応じてスコアを計算
            if (number !== 50) {
              if (doubleButtonActive === true)  {
                number = number * 2
              }　else if(tripleButtonActive === true) {
                number = number * 3
              }
            }
            numClick(number)
            }}>
            {number}
          </StyledButton>
        ))}
          <ScoreAreaButton onClick={() => toggleButtonState("Single")} isActive={singleButtonActive}>
            Single
          </ScoreAreaButton>
          <ScoreAreaButton onClick={() => toggleButtonState("Double")} isActive={doubleButtonActive}>
            Double
          </ScoreAreaButton>
          <ScoreAreaButton onClick={() => toggleButtonState("Triple")} isActive={tripleButtonActive}>
            Triple
          </ScoreAreaButton>
        <StyledButton onClick={() =>  numClick("OK")}>OK</StyledButton>
        <StyledButton 
          onClick={() =>  
            numClick("取り消し")
          }>取り消し
        </StyledButton>
      </Container>
      );
  };
  
  const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    align-items: center;
    margin: 200px 0;
  `;
  
  const StyledButton = styled.button`
    padding: 10px 15px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  
    &:hover {
      background-color: #0056b3;
    }
  
    &:active {
      background-color: #004494;
    }
  `;

  const ScoreAreaButton = styled.button<{ isActive: boolean }>`
    padding: 10px 15px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  
   background-color: ${(props) => (props.isActive ? "#4caf50" : "#d3d3d3")};
  color: ${(props) => (props.isActive ? "white" : "black")};
  &:hover {
    background-color: ${(props) => (props.isActive ? "#45a049" : "#c0c0c0")};
  }
  `;
  
  export default ScoreButton;