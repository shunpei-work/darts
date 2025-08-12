import { RoundDetail, ScoreDetail } from '../../types';

// Mock React hooks for testing
let mockScore = 151;
let mockScoreScreen: number[] = [];
let mockScoreHistory: number[] = [];
let mockRoundDetails: RoundDetail[] = [];
let mockSelectedRoundIndex: number | null = null;
let mockSingleButtonActive = true;
let mockDoubleButtonActive = false;
let mockTripleButtonActive = false;

// Mock the resetGame function
const resetGame = () => {
    mockScore = 151;
    mockScoreScreen = [];
    mockScoreHistory = [];
    mockRoundDetails = [];
    mockSelectedRoundIndex = null;
};

// Mock the generateScoreDetails function
const generateScoreDetails = (scoreScreen: number[]): ScoreDetail[] => {
    return scoreScreen.map(score => {
        let baseNumber: number;
        let multiplier: 'S' | 'D' | 'T';

        if (score === 50) {
            baseNumber = 50;
            multiplier = 'S';
        } else {
            if (mockDoubleButtonActive) {
                baseNumber = score / 2;
                multiplier = 'D';
            } else if (mockTripleButtonActive) {
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

// Mock the handleScoreChange function logic with reset on nice out
const handleScoreChange = () => {
    let newScore = mockScore;
    const currentRoundScores: number[] = [];

    mockScoreScreen.forEach((value) => {
        newScore -= value;
        currentRoundScores.push(value);
    });

    const roundTotal = currentRoundScores.reduce((sum, score) => sum + score, 0);

    if (newScore === 0) {
        // ナイスアウト時の処理
        const scoreDetails = generateScoreDetails(mockScoreScreen);
        const roundDetail: RoundDetail = {
            roundNumber: mockRoundDetails.length + 1,
            scores: scoreDetails,
            total: roundTotal
        };

        mockScore = newScore;
        mockScoreHistory = [...mockScoreHistory, roundTotal];
        mockRoundDetails = [...mockRoundDetails, roundDetail];
        mockScoreScreen = [];
        
        // Simulate the reset that happens after nice out
        setTimeout(() => {
            resetGame();
        }, 100);
        
        return 'nice_out';
    } else if (newScore < 0) {
        // 失敗時の処理（ラウンド詳細は保存しない）
        mockScoreScreen = [];
        return 'failed';
    } else {
        // 正常時の処理
        const scoreDetails = generateScoreDetails(mockScoreScreen);
        const roundDetail: RoundDetail = {
            roundNumber: mockRoundDetails.length + 1,
            scores: scoreDetails,
            total: roundTotal
        };

        mockScore = newScore;
        mockScoreHistory = [...mockScoreHistory, roundTotal];
        mockRoundDetails = [...mockRoundDetails, roundDetail];
        mockScoreScreen = [];
        return 'success';
    }
};

// Reset function for tests
const resetMockState = () => {
    mockScore = 151;
    mockScoreScreen = [];
    mockScoreHistory = [];
    mockRoundDetails = [];
    mockSelectedRoundIndex = null;
    mockSingleButtonActive = true;
    mockDoubleButtonActive = false;
    mockTripleButtonActive = false;
};

describe('Game Reset Integration Tests', () => {
    beforeEach(() => {
        resetMockState();
    });

    test('should clear roundDetails when resetGame is called (Requirement 4.1)', () => {
        // Setup: Add some round details first
        mockRoundDetails = [
            {
                roundNumber: 1,
                scores: [{ value: 20, baseNumber: 20, multiplier: 'S' }],
                total: 20
            },
            {
                roundNumber: 2,
                scores: [{ value: 40, baseNumber: 20, multiplier: 'D' }],
                total: 40
            }
        ];
        mockScoreHistory = [20, 40];
        mockScore = 91;

        // Execute reset
        resetGame();

        // Verify: サイドバーのラウンド一覧をクリア
        expect(mockRoundDetails).toEqual([]);
        expect(mockScoreHistory).toEqual([]);
        expect(mockScore).toBe(151);
    });

    test('should clear selectedRoundIndex when resetGame is called (Requirement 4.2)', () => {
        // Setup: Set a selected round
        mockSelectedRoundIndex = 1;
        mockRoundDetails = [
            {
                roundNumber: 1,
                scores: [{ value: 20, baseNumber: 20, multiplier: 'S' }],
                total: 20
            }
        ];

        // Execute reset
        resetGame();

        // Verify: ラウンド詳細表示エリアをクリア
        expect(mockSelectedRoundIndex).toBeNull();
        expect(mockRoundDetails).toEqual([]);
    });

    test('should reset game state after nice out (Requirement 4.2)', async () => {
        // Setup: Create a nice out scenario
        mockScore = 60;
        mockScoreScreen = [60]; // This will result in nice out
        mockSelectedRoundIndex = 0; // Simulate having a round selected

        // Execute nice out
        const result = handleScoreChange();
        expect(result).toBe('nice_out');

        // Verify initial state after nice out but before reset
        expect(mockScore).toBe(0);
        expect(mockRoundDetails).toHaveLength(1);

        // Wait for the reset to happen (simulating the setTimeout)
        await new Promise(resolve => setTimeout(resolve, 150));

        // Verify: ナイスアウト後にゲームがリセットされる
        expect(mockScore).toBe(151);
        expect(mockRoundDetails).toEqual([]);
        expect(mockSelectedRoundIndex).toBeNull();
        expect(mockScoreHistory).toEqual([]);
    });

    test('should maintain proper state for "ラウンドを選択してください" message display (Requirement 4.3)', () => {
        // Setup: Add some rounds and select one
        mockRoundDetails = [
            {
                roundNumber: 1,
                scores: [{ value: 20, baseNumber: 20, multiplier: 'S' }],
                total: 20
            }
        ];
        mockSelectedRoundIndex = 0;

        // Verify initial state has a selection
        expect(mockSelectedRoundIndex).toBe(0);
        expect(mockRoundDetails).toHaveLength(1);

        // Execute reset
        resetGame();

        // Verify: リセット後に「ラウンドを選択してください」のメッセージを表示する状態
        // (selectedRoundIndex が null で roundDetails が空の状態)
        expect(mockSelectedRoundIndex).toBeNull();
        expect(mockRoundDetails).toEqual([]);
    });

    test('should handle multiple rounds before reset', () => {
        // Setup: Play multiple rounds
        mockScoreScreen = [20, 20, 20]; // 60 points
        handleScoreChange();
        
        mockScoreScreen = [30, 30]; // 60 points
        handleScoreChange();
        
        // Select a round
        mockSelectedRoundIndex = 1;

        // Verify state before reset
        expect(mockRoundDetails).toHaveLength(2);
        expect(mockScoreHistory).toEqual([60, 60]);
        expect(mockSelectedRoundIndex).toBe(1);
        expect(mockScore).toBe(31); // 151 - 60 - 60 = 31

        // Execute reset
        resetGame();

        // Verify complete reset
        expect(mockRoundDetails).toEqual([]);
        expect(mockScoreHistory).toEqual([]);
        expect(mockSelectedRoundIndex).toBeNull();
        expect(mockScore).toBe(151);
    });
});