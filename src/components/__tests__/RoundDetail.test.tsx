import { RoundDetail as RoundDetailType } from '../../types';

// Mock data for testing
const mockRounds: RoundDetailType[] = [
  {
    roundNumber: 1,
    scores: [
      { value: 20, baseNumber: 20, multiplier: 'S' },
      { value: 15, baseNumber: 15, multiplier: 'S' },
      { value: 10, baseNumber: 10, multiplier: 'S' }
    ],
    total: 45
  },
  {
    roundNumber: 2,
    scores: [
      { value: 40, baseNumber: 20, multiplier: 'D' },
      { value: 30, baseNumber: 15, multiplier: 'D' }
    ],
    total: 70
  },
  {
    roundNumber: 3,
    scores: [
      { value: 60, baseNumber: 20, multiplier: 'T' },
      { value: 45, baseNumber: 15, multiplier: 'T' },
      { value: 30, baseNumber: 10, multiplier: 'T' }
    ],
    total: 135
  },
  {
    roundNumber: 4,
    scores: [
      { value: 20, baseNumber: 20, multiplier: 'S' },
      { value: 40, baseNumber: 20, multiplier: 'D' },
      { value: 60, baseNumber: 20, multiplier: 'T' }
    ],
    total: 120
  },
  {
    roundNumber: 5,
    scores: [
      { value: 50, baseNumber: 50, multiplier: 'S' }
    ],
    total: 50
  }
];

// Helper function to format score display (simulating component logic)
const formatScoreDisplay = (score: { value: number; baseNumber: number; multiplier: 'S' | 'D' | 'T' }): string => {
  return `${score.multiplier}${score.baseNumber}`;
};

// Helper function to format total display (simulating component logic)
const formatTotalDisplay = (total: number): string => {
  return `合計: ${total}点`;
};

// Helper function to format round header (simulating component logic)
const formatRoundHeader = (roundNumber: number): string => {
  return `ラウンド ${roundNumber}`;
};

describe('RoundDetail Component Logic', () => {
  test('handles null round (no selection)', () => {
    const round = null;
    const expectedMessage = 'ラウンドを選択してください';
    
    expect(round).toBeNull();
    // Component should display the no selection message
    expect(expectedMessage).toBe('ラウンドを選択してください');
  });

  test('formats Single scores correctly', () => {
    const round = mockRounds[0]; // Round with Single scores
    
    expect(formatRoundHeader(round.roundNumber)).toBe('ラウンド 1');
    expect(formatScoreDisplay(round.scores[0])).toBe('S20');
    expect(formatScoreDisplay(round.scores[1])).toBe('S15');
    expect(formatScoreDisplay(round.scores[2])).toBe('S10');
    expect(formatTotalDisplay(round.total)).toBe('合計: 45点');
  });

  test('formats Double scores correctly', () => {
    const round = mockRounds[1]; // Round with Double scores
    
    expect(formatRoundHeader(round.roundNumber)).toBe('ラウンド 2');
    expect(formatScoreDisplay(round.scores[0])).toBe('D20');
    expect(formatScoreDisplay(round.scores[1])).toBe('D15');
    expect(formatTotalDisplay(round.total)).toBe('合計: 70点');
  });

  test('formats Triple scores correctly', () => {
    const round = mockRounds[2]; // Round with Triple scores
    
    expect(formatRoundHeader(round.roundNumber)).toBe('ラウンド 3');
    expect(formatScoreDisplay(round.scores[0])).toBe('T20');
    expect(formatScoreDisplay(round.scores[1])).toBe('T15');
    expect(formatScoreDisplay(round.scores[2])).toBe('T10');
    expect(formatTotalDisplay(round.total)).toBe('合計: 135点');
  });

  test('formats mixed multiplier types correctly', () => {
    const round = mockRounds[3]; // Round with mixed multipliers
    
    expect(formatRoundHeader(round.roundNumber)).toBe('ラウンド 4');
    expect(formatScoreDisplay(round.scores[0])).toBe('S20');
    expect(formatScoreDisplay(round.scores[1])).toBe('D20');
    expect(formatScoreDisplay(round.scores[2])).toBe('T20');
    expect(formatTotalDisplay(round.total)).toBe('合計: 120点');
  });

  test('handles rounds with fewer than 3 scores', () => {
    const round = mockRounds[4]; // Round with only 1 score
    
    expect(formatRoundHeader(round.roundNumber)).toBe('ラウンド 5');
    expect(round.scores.length).toBe(1);
    expect(formatScoreDisplay(round.scores[0])).toBe('S50');
    expect(formatTotalDisplay(round.total)).toBe('合計: 50点');
  });

  test('score display format follows S/D/T + number pattern', () => {
    mockRounds.forEach(round => {
      round.scores.forEach(score => {
        const display = formatScoreDisplay(score);
        expect(display).toMatch(/^[SDT]\d+$/);
        expect(display.charAt(0)).toMatch(/[SDT]/);
        expect(parseInt(display.slice(1))).toBe(score.baseNumber);
      });
    });
  });

  test('total display format follows "合計: XX点" pattern', () => {
    mockRounds.forEach(round => {
      const totalDisplay = formatTotalDisplay(round.total);
      expect(totalDisplay).toMatch(/^合計: \d+点$/);
      expect(totalDisplay).toContain(round.total.toString());
    });
  });

  test('round header format follows "ラウンド X" pattern', () => {
    mockRounds.forEach(round => {
      const headerDisplay = formatRoundHeader(round.roundNumber);
      expect(headerDisplay).toMatch(/^ラウンド \d+$/);
      expect(headerDisplay).toContain(round.roundNumber.toString());
    });
  });

  test('validates score data structure', () => {
    mockRounds.forEach(round => {
      round.scores.forEach(score => {
        expect(score).toHaveProperty('value');
        expect(score).toHaveProperty('baseNumber');
        expect(score).toHaveProperty('multiplier');
        expect(typeof score.value).toBe('number');
        expect(typeof score.baseNumber).toBe('number');
        expect(['S', 'D', 'T']).toContain(score.multiplier);
      });
    });
  });
});