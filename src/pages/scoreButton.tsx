import * as React from 'react'
import styled from 'styled-components'

interface ScoreButtonProps {
    numClick: (value) => void;
    singleButtonActive: boolean;
    doubleButtonActive: boolean;
    tripleButtonActive: boolean;
    onMultiplierToggle: (value: string) => void;
  }
  
// スコアボタンのコンポーネントを定義
// 数字をクリック、OKをクリックで「スコア入力」に値を追加
const ScoreButton: React.FC<ScoreButtonProps> = ({ 
  numClick, 
  singleButtonActive, 
  doubleButtonActive, 
  tripleButtonActive, 
  onMultiplierToggle 
}) => {
    // 数値リストを定義
    const numbers = [...Array(20).keys()].map((num) => num + 1).concat(50);
  
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
          <ScoreAreaButton onClick={() => onMultiplierToggle("Single")} isActive={singleButtonActive}>
            Single
          </ScoreAreaButton>
          <ScoreAreaButton onClick={() => onMultiplierToggle("Double")} isActive={doubleButtonActive}>
            Double
          </ScoreAreaButton>
          <ScoreAreaButton onClick={() => onMultiplierToggle("Triple")} isActive={tripleButtonActive}>
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
    padding: 0 1rem; /* Add horizontal padding for better mobile experience */
    
    @media (max-width: 768px) {
      margin: 50px 0; /* Reduce top/bottom margin on mobile */
      gap: 8px; /* Slightly reduce gap on mobile */
    }
    
    @media (max-width: 480px) {
      gap: 5px; /* Further reduce gap on very small screens */
      padding: 0 0.5rem;
    }
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
    min-width: 44px; /* Ensure minimum touch target size */
    min-height: 44px;
  
    &:hover {
      background-color: #0056b3;
    }
  
    &:active {
      background-color: #004494;
    }
    
    @media (max-width: 480px) {
      padding: 8px 12px; /* Slightly reduce padding on very small screens */
      font-size: 14px; /* Slightly reduce font size */
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
    min-width: 44px; /* Ensure minimum touch target size */
    min-height: 44px;
  
   background-color: ${(props) => (props.isActive ? "#4caf50" : "#d3d3d3")};
  color: ${(props) => (props.isActive ? "white" : "black")};
  &:hover {
    background-color: ${(props) => (props.isActive ? "#45a049" : "#c0c0c0")};
  }
  
  @media (max-width: 480px) {
    padding: 8px 12px; /* Slightly reduce padding on very small screens */
    font-size: 14px; /* Slightly reduce font size */
  }
  `;
  
  export default ScoreButton;