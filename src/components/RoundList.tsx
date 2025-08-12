import * as React from 'react';
import styled from 'styled-components';
import { RoundDetail } from '../types';

const RoundListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const RoundItem = styled.div<{ isSelected: boolean }>`
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  background: ${props => props.isSelected ? '#007bff' : '#fff'};
  color: ${props => props.isSelected ? '#fff' : '#333'};
  border: 1px solid ${props => props.isSelected ? '#007bff' : '#ddd'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.isSelected ? '#0056b3' : '#f8f9fa'};
    border-color: ${props => props.isSelected ? '#0056b3' : '#007bff'};
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const RoundTitle = styled.div`
  font-weight: 500;
  font-size: 0.9rem;
`;

interface RoundListProps {
  rounds: RoundDetail[];
  selectedRoundIndex: number | null;
  onRoundSelect: (index: number) => void;
}

export const RoundList: React.FC<RoundListProps> = ({
  rounds,
  selectedRoundIndex,
  onRoundSelect
}) => {
  return (
    <RoundListContainer>
      {rounds.map((round, index) => (
        <RoundItem
          key={round.roundNumber}
          isSelected={selectedRoundIndex === index}
          onClick={() => onRoundSelect(index)}
        >
          <RoundTitle>ラウンド {round.roundNumber}</RoundTitle>
        </RoundItem>
      ))}
    </RoundListContainer>
  );
};