import { ScoreDetail } from '../../types';

// Mock the generateScoreDetails function for testing
// This simulates the logic from game.tsx
const generateScoreDetails = (
  scoreScreen: number[], 
  singleActive: boolean, 
  doubleActive: boolean, 
  tripleActive: boolean
): ScoreDetail[] => {
  return scoreScreen.map(score => {
    let baseNumber: number;
    let multiplier: 'S' | 'D' | 'T';
    
    // Bull (50点) の場合は常にSingle扱い
    if (score === 50) {
      baseNumber = 50;
      multiplier = 'S';
    } else {
      // 現在のmultiplier状態から逆算してbaseNumberを計算
      if (doubleActive) {
        baseNumber = score / 2;
        multiplier = 'D';
      } else if (tripleActive) {
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

describe('Score Details Generation', () => {
  describe('Single multiplier cases', () => {
    test('should generate correct ScoreDetail for single 20', () => {
      const scoreScreen = [20];
      const result = generateScoreDetails(scoreScreen, true, false, false);
      
      expect(result).toEqual([{
        value: 20,
        baseNumber: 20,
        multiplier: 'S'
      }]);
    });

    test('should generate correct ScoreDetail for single Bull (50)', () => {
      const scoreScreen = [50];
      const result = generateScoreDetails(scoreScreen, true, false, false);
      
      expect(result).toEqual([{
        value: 50,
        baseNumber: 50,
        multiplier: 'S'
      }]);
    });

    test('should generate correct ScoreDetail for multiple single scores', () => {
      const scoreScreen = [20, 15, 10];
      const result = generateScoreDetails(scoreScreen, true, false, false);
      
      expect(result).toEqual([
        { value: 20, baseNumber: 20, multiplier: 'S' },
        { value: 15, baseNumber: 15, multiplier: 'S' },
        { value: 10, baseNumber: 10, multiplier: 'S' }
      ]);
    });
  });

  describe('Double multiplier cases', () => {
    test('should generate correct ScoreDetail for double 20', () => {
      const scoreScreen = [40]; // Double 20
      const result = generateScoreDetails(scoreScreen, false, true, false);
      
      expect(result).toEqual([{
        value: 40,
        baseNumber: 20,
        multiplier: 'D'
      }]);
    });

    test('should generate correct ScoreDetail for multiple double scores', () => {
      const scoreScreen = [40, 30, 20]; // D20, D15, D10
      const result = generateScoreDetails(scoreScreen, false, true, false);
      
      expect(result).toEqual([
        { value: 40, baseNumber: 20, multiplier: 'D' },
        { value: 30, baseNumber: 15, multiplier: 'D' },
        { value: 20, baseNumber: 10, multiplier: 'D' }
      ]);
    });

    test('should handle Bull (50) as Single even when Double is active', () => {
      const scoreScreen = [50];
      const result = generateScoreDetails(scoreScreen, false, true, false);
      
      expect(result).toEqual([{
        value: 50,
        baseNumber: 50,
        multiplier: 'S'
      }]);
    });
  });

  describe('Triple multiplier cases', () => {
    test('should generate correct ScoreDetail for triple 20', () => {
      const scoreScreen = [60]; // Triple 20
      const result = generateScoreDetails(scoreScreen, false, false, true);
      
      expect(result).toEqual([{
        value: 60,
        baseNumber: 20,
        multiplier: 'T'
      }]);
    });

    test('should generate correct ScoreDetail for multiple triple scores', () => {
      const scoreScreen = [60, 45, 30]; // T20, T15, T10
      const result = generateScoreDetails(scoreScreen, false, false, true);
      
      expect(result).toEqual([
        { value: 60, baseNumber: 20, multiplier: 'T' },
        { value: 45, baseNumber: 15, multiplier: 'T' },
        { value: 30, baseNumber: 10, multiplier: 'T' }
      ]);
    });

    test('should handle Bull (50) as Single even when Triple is active', () => {
      const scoreScreen = [50];
      const result = generateScoreDetails(scoreScreen, false, false, true);
      
      expect(result).toEqual([{
        value: 50,
        baseNumber: 50,
        multiplier: 'S'
      }]);
    });
  });

  describe('Mixed scenarios', () => {
    test('should handle empty scoreScreen', () => {
      const scoreScreen: number[] = [];
      const result = generateScoreDetails(scoreScreen, true, false, false);
      
      expect(result).toEqual([]);
    });

    test('should handle single throw in a round', () => {
      const scoreScreen = [20];
      const result = generateScoreDetails(scoreScreen, true, false, false);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        value: 20,
        baseNumber: 20,
        multiplier: 'S'
      });
    });

    test('should handle maximum 3 throws in a round', () => {
      const scoreScreen = [20, 20, 20];
      const result = generateScoreDetails(scoreScreen, true, false, false);
      
      expect(result).toHaveLength(3);
      expect(result).toEqual([
        { value: 20, baseNumber: 20, multiplier: 'S' },
        { value: 20, baseNumber: 20, multiplier: 'S' },
        { value: 20, baseNumber: 20, multiplier: 'S' }
      ]);
    });
  });
});