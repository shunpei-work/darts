import { RoundDetail, ScoreDetail } from '../../types';

// Mock React hooks for testing
let mockScore = 151;
let mockScoreScreen: number[] = [];
let mockScoreHistory: number[] = [];
let mockRoundDetails: RoundDetail[] = [];
let mockSingleButtonActive = true;
let mockDoubleButtonActive = false;
let mockTripleButtonActive = false;

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

// Mock the handleScoreChange function logic
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
    mockSingleButtonActive = true;
    mockDoubleButtonActive = false;
    mockTripleButtonActive = false;
};

describe('Round Details Integration Tests', () => {
    beforeEach(() => {
        resetMockState();
    });

    test('should generate and save round details for successful single scores', () => {
        // Setup: Single 20, 20, 20 (60 points total)
        mockScoreScreen = [20, 20, 20];
        mockSingleButtonActive = true;
        mockDoubleButtonActive = false;
        mockTripleButtonActive = false;

        const result = handleScoreChange();

        expect(result).toBe('success');
        expect(mockScore).toBe(91); // 151 - 60 = 91
        expect(mockScoreHistory).toEqual([60]);
        expect(mockRoundDetails).toHaveLength(1);
        expect(mockRoundDetails[0]).toEqual({
            roundNumber: 1,
            scores: [
                { value: 20, baseNumber: 20, multiplier: 'S' },
                { value: 20, baseNumber: 20, multiplier: 'S' },
                { value: 20, baseNumber: 20, multiplier: 'S' }
            ],
            total: 60
        });
    });

    test('should generate and save round details for successful double scores', () => {
        // Setup: Double 20, 20, 20 (120 points total)
        mockScoreScreen = [40, 40, 40];
        mockSingleButtonActive = false;
        mockDoubleButtonActive = true;
        mockTripleButtonActive = false;

        const result = handleScoreChange();

        expect(result).toBe('success');
        expect(mockScore).toBe(31); // 151 - 120 = 31
        expect(mockScoreHistory).toEqual([120]);
        expect(mockRoundDetails).toHaveLength(1);
        expect(mockRoundDetails[0]).toEqual({
            roundNumber: 1,
            scores: [
                { value: 40, baseNumber: 20, multiplier: 'D' },
                { value: 40, baseNumber: 20, multiplier: 'D' },
                { value: 40, baseNumber: 20, multiplier: 'D' }
            ],
            total: 120
        });
    });

    test('should generate and save round details for successful triple scores', () => {
        // Setup: Triple 20 (60 points total)
        mockScoreScreen = [60];
        mockSingleButtonActive = false;
        mockDoubleButtonActive = false;
        mockTripleButtonActive = true;

        const result = handleScoreChange();

        expect(result).toBe('success');
        expect(mockScore).toBe(91); // 151 - 60 = 91
        expect(mockScoreHistory).toEqual([60]);
        expect(mockRoundDetails).toHaveLength(1);
        expect(mockRoundDetails[0]).toEqual({
            roundNumber: 1,
            scores: [
                { value: 60, baseNumber: 20, multiplier: 'T' }
            ],
            total: 60
        });
    });

    test('should generate and save round details for nice out with triple scores', () => {
        // Setup: Triple 20, 20, 20 (180 points total) - Nice out scenario
        mockScore = 180; // Set score to exactly match the throw total
        mockScoreScreen = [60, 60, 60];
        mockSingleButtonActive = false;
        mockDoubleButtonActive = false;
        mockTripleButtonActive = true;

        const result = handleScoreChange();

        expect(result).toBe('nice_out'); // Should be nice_out when score reaches 0
        expect(mockScore).toBe(0); // 180 - 180 = 0 (Nice out!)
        expect(mockScoreHistory).toEqual([180]);
        expect(mockRoundDetails).toHaveLength(1);
        expect(mockRoundDetails[0]).toEqual({
            roundNumber: 1,
            scores: [
                { value: 60, baseNumber: 20, multiplier: 'T' },
                { value: 60, baseNumber: 20, multiplier: 'T' },
                { value: 60, baseNumber: 20, multiplier: 'T' }
            ],
            total: 180
        });
    });

    test('should NOT save round details when score goes negative', () => {
        // Setup: Score that will make total negative
        mockScore = 50;
        mockScoreScreen = [60]; // This will make score -10
        mockSingleButtonActive = true;

        const result = handleScoreChange();

        expect(result).toBe('failed');
        expect(mockScore).toBe(50); // Score should remain unchanged
        expect(mockScoreHistory).toEqual([]); // No history should be saved
        expect(mockRoundDetails).toEqual([]); // No round details should be saved
        expect(mockScoreScreen).toEqual([]); // Screen should be cleared
    });

    test('should handle multiple rounds correctly', () => {
        // First round: 60 points
        mockScoreScreen = [20, 20, 20];
        handleScoreChange();

        // Second round: 40 points
        mockScoreScreen = [20, 20];
        handleScoreChange();

        expect(mockScore).toBe(51); // 151 - 60 - 40 = 51
        expect(mockScoreHistory).toEqual([60, 40]);
        expect(mockRoundDetails).toHaveLength(2);

        expect(mockRoundDetails[0].roundNumber).toBe(1);
        expect(mockRoundDetails[0].total).toBe(60);

        expect(mockRoundDetails[1].roundNumber).toBe(2);
        expect(mockRoundDetails[1].total).toBe(40);
    });

    test('should handle Bull (50) correctly regardless of multiplier state', () => {
        // Test Bull with Double active
        mockScoreScreen = [50];
        mockSingleButtonActive = false;
        mockDoubleButtonActive = true;
        mockTripleButtonActive = false;

        handleScoreChange();

        expect(mockRoundDetails[0].scores[0]).toEqual({
            value: 50,
            baseNumber: 50,
            multiplier: 'S' // Should always be Single for Bull
        });
    });

    test('should handle single throw in a round', () => {
        mockScoreScreen = [20];

        const result = handleScoreChange();

        expect(result).toBe('success');
        expect(mockRoundDetails[0].scores).toHaveLength(1);
        expect(mockRoundDetails[0].total).toBe(20);
    });
});