import * as React from 'react';
import styled from 'styled-components';
import { RoundDetail as RoundDetailType } from '../types';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const NoSelectionMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  font-style: italic;
`;

const RoundHeader = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: #333;
`;

const ScoresList = styled.div`
  flex: 1;
  margin-bottom: 1rem;
`;

const ScoreItem = styled.div`
  padding: 0.25rem 0;
  font-family: monospace;
  font-size: 1rem;
  color: #444;
`;

const TotalScore = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
  color: #333;
  border-top: 1px solid #ddd;
  padding-top: 0.5rem;
`;

interface RoundDetailProps {
  round: RoundDetailType | null;
}

export const RoundDetail: React.FC<RoundDetailProps> = ({ round }) => {
  if (!round) {
    return (
      <Container>
        <NoSelectionMessage>
          ラウンドを選択してください
        </NoSelectionMessage>
      </Container>
    );
  }

  return (
    <Container>
      <RoundHeader>ラウンド {round.roundNumber}</RoundHeader>
      <ScoresList>
        {round.scores.map((score, index) => (
          <ScoreItem key={index}>
            {score.multiplier}{score.baseNumber}
          </ScoreItem>
        ))}
      </ScoresList>
      <TotalScore>
        合計: {round.total}点
      </TotalScore>
    </Container>
  );
};