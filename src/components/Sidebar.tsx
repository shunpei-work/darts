import * as React from 'react';
import styled from 'styled-components';
import { RoundDetail as RoundDetailType } from '../types';
import { RoundList } from './RoundList';
import { RoundDetail } from './RoundDetail';

const SidebarContainer = styled.div`
  width: 300px;
  background: #f5f5f5;
  border-left: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  height: 100vh;
  flex-shrink: 0; /* Prevent sidebar from shrinking */
  
  @media (max-width: 1024px) {
    width: 250px; /* Reduce width on tablets */
  }
  
  @media (max-width: 768px) {
    width: 100%;
    height: 40vh; /* Give sidebar 40% of screen height on mobile */
    border-left: none;
    border-top: 1px solid #ddd;
  }
`;

const RoundListSection = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  
  @media (max-width: 768px) {
    padding: 0.5rem; /* Reduce padding on mobile */
  }
`;

const RoundDetailSection = styled.div`
  height: 200px;
  border-top: 1px solid #ddd;
  padding: 1rem;
  background: #fff;
  
  @media (max-width: 768px) {
    height: 150px; /* Reduce height on mobile */
    padding: 0.5rem; /* Reduce padding on mobile */
  }
`;

interface SidebarProps {
  rounds: RoundDetailType[];
  selectedRoundIndex: number | null;
  onRoundSelect: (index: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  rounds,
  selectedRoundIndex,
  onRoundSelect
}) => {
  return (
    <SidebarContainer>
      <RoundListSection>
        <RoundList
          rounds={rounds}
          selectedRoundIndex={selectedRoundIndex}
          onRoundSelect={onRoundSelect}
        />
      </RoundListSection>
      <RoundDetailSection>
        <RoundDetail 
          round={selectedRoundIndex !== null ? rounds[selectedRoundIndex] : null}
        />
      </RoundDetailSection>
    </SidebarContainer>
  );
};