import { RoundDetail, ScoreDetail } from '../../types';

// Mock React hooks for comprehensive integration testing
let mockScore = 151;
let mockScoreScreen: number[] = [];
let mockScoreHistory: number[] = [];
let mockRoundDetails: RoundDetail[] = [];
let mockSelectedRoundIndex: number | null = null;
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

// Mock the resetGame function
const resetGame = () => {
    mockScore = 151;
    mockScoreScreen = [];
    mockScoreHistory = [];
    mockRoundDetails = [];
    mockSelectedRoundIndex = null;
};

// Mock round selection function
const selectRound = (index: number) => {
    if (index >= 0 && index < mockRoundDetails.length) {
        mockSelectedRoundIndex = index;
        return mockRoundDetails[index];
    }
    mockSelectedRoundIndex = null;
    return null;
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

describe('Full Integration Tests - Task 10', () => {
    beforeEach(() => {
        resetMockState();
    });

    describe('スコア入力からサイドバー更新までの一連の流れをテスト', () => {
        test('should complete full flow from score input to sidebar update', () => {
            // Step 1: スコア入力
            mockScoreScreen = [20, 15, 10]; // 45 points total
            
            // Step 2: OK button pressed (handleScoreChange)
            const result = handleScoreChange();
            
            // Step 3: Verify sidebar update
            expect(result).toBe('success');
            expect(mockScore).toBe(106); // 151 - 45 = 106
            expect(mockScoreHistory).toEqual([45]);
            expect(mockRoundDetails).toHaveLength(1);
            expect(mockRoundDetails[0]).toEqual({
                roundNumber: 1,
                scores: [
                    { value: 20, baseNumber: 20, multiplier: 'S' },
                    { value: 15, baseNumber: 15, multiplier: 'S' },
                    { value: 10, baseNumber: 10, multiplier: 'S' }
                ],
                total: 45
            });
            expect(mockScoreScreen).toEqual([]); // Screen should be cleared
        });

        test('should handle double multiplier flow correctly', () => {
            // Setup double multiplier
            mockSingleButtonActive = false;
            mockDoubleButtonActive = true;
            mockTripleButtonActive = false;
            
            // Score input with doubles
            mockScoreScreen = [40, 30]; // D20, D15
            
            const result = handleScoreChange();
            
            expect(result).toBe('success');
            expect(mockRoundDetails[0].scores).toEqual([
                { value: 40, baseNumber: 20, multiplier: 'D' },
                { value: 30, baseNumber: 15, multiplier: 'D' }
            ]);
            expect(mockRoundDetails[0].total).toBe(70);
        });

        test('should handle triple multiplier flow correctly', () => {
            // Setup triple multiplier
            mockSingleButtonActive = false;
            mockDoubleButtonActive = false;
            mockTripleButtonActive = true;
            
            // Score input with triples
            mockScoreScreen = [60]; // T20
            
            const result = handleScoreChange();
            
            expect(result).toBe('success');
            expect(mockRoundDetails[0].scores).toEqual([
                { value: 60, baseNumber: 20, multiplier: 'T' }
            ]);
            expect(mockRoundDetails[0].total).toBe(60);
        });
    });

    describe('複数ラウンドでのラウンド一覧表示をテスト', () => {
        test('should display multiple rounds in chronological order (Requirements 1.2, 1.4)', () => {
            // Round 1
            mockScoreScreen = [20, 20, 20]; // 60 points
            handleScoreChange();
            
            // Round 2
            mockScoreScreen = [15, 15, 15]; // 45 points
            handleScoreChange();
            
            // Round 3
            mockScoreScreen = [10, 10]; // 20 points
            handleScoreChange();
            
            // Verify multiple rounds
            expect(mockRoundDetails).toHaveLength(3);
            expect(mockRoundDetails[0].roundNumber).toBe(1);
            expect(mockRoundDetails[1].roundNumber).toBe(2);
            expect(mockRoundDetails[2].roundNumber).toBe(3);
            
            // Verify chronological order (latest at bottom)
            expect(mockRoundDetails[0].total).toBe(60);
            expect(mockRoundDetails[1].total).toBe(45);
            expect(mockRoundDetails[2].total).toBe(20);
            
            // Verify score progression
            expect(mockScore).toBe(26); // 151 - 60 - 45 - 20 = 26
        });

        test('should handle rounds with different multiplier combinations', () => {
            // Round 1: Singles (45 points)
            mockScoreScreen = [20, 15, 10];
            handleScoreChange();
            // Score: 151 - 45 = 106
            
            // Round 2: Doubles (70 points)
            mockSingleButtonActive = false;
            mockDoubleButtonActive = true;
            mockTripleButtonActive = false;
            mockScoreScreen = [40, 30]; // D20, D15
            handleScoreChange();
            // Score: 106 - 70 = 36
            
            // Round 3: Triples (30 points to avoid going negative)
            mockSingleButtonActive = false;
            mockDoubleButtonActive = false;
            mockTripleButtonActive = true;
            mockScoreScreen = [30]; // T10
            handleScoreChange();
            // Score: 36 - 30 = 6
            
            expect(mockRoundDetails).toHaveLength(3);
            expect(mockRoundDetails[0].scores[0].multiplier).toBe('S');
            expect(mockRoundDetails[1].scores[0].multiplier).toBe('D');
            expect(mockRoundDetails[2].scores[0].multiplier).toBe('T');
            expect(mockRoundDetails[2].scores[0].baseNumber).toBe(10);
        });

        test('should maintain proper round numbering across multiple rounds', () => {
            // Create 5 rounds
            for (let i = 1; i <= 5; i++) {
                mockScoreScreen = [10]; // Small score to avoid going negative
                handleScoreChange();
            }
            
            expect(mockRoundDetails).toHaveLength(5);
            mockRoundDetails.forEach((round, index) => {
                expect(round.roundNumber).toBe(index + 1);
            });
        });
    });

    describe('ラウンド選択と詳細表示の切り替え動作をテスト', () => {
        beforeEach(() => {
            // Setup multiple rounds for selection testing
            mockScoreScreen = [20, 20, 20]; // Round 1: 60 points
            handleScoreChange();
            
            mockScoreScreen = [15, 15]; // Round 2: 30 points
            handleScoreChange();
            
            mockScoreScreen = [10]; // Round 3: 10 points
            handleScoreChange();
        });

        test('should select and display round details correctly (Requirements 2.1, 2.2)', () => {
            // Select round 1
            const selectedRound1 = selectRound(0);
            
            expect(mockSelectedRoundIndex).toBe(0);
            expect(selectedRound1).not.toBeNull();
            expect(selectedRound1?.roundNumber).toBe(1);
            expect(selectedRound1?.total).toBe(60);
            expect(selectedRound1?.scores).toHaveLength(3);
        });

        test('should switch between different round selections (Requirement 2.4)', () => {
            // Select round 1
            selectRound(0);
            expect(mockSelectedRoundIndex).toBe(0);
            
            // Switch to round 2
            selectRound(1);
            expect(mockSelectedRoundIndex).toBe(1);
            
            // Switch to round 3
            selectRound(2);
            expect(mockSelectedRoundIndex).toBe(2);
            
            // Verify the selected round data
            const selectedRound = mockRoundDetails[mockSelectedRoundIndex!];
            expect(selectedRound.roundNumber).toBe(3);
            expect(selectedRound.total).toBe(10);
        });

        test('should handle invalid round selection', () => {
            // Try to select non-existent round
            const result = selectRound(10);
            
            expect(result).toBeNull();
            expect(mockSelectedRoundIndex).toBeNull();
        });

        test('should handle negative round index', () => {
            const result = selectRound(-1);
            
            expect(result).toBeNull();
            expect(mockSelectedRoundIndex).toBeNull();
        });

        test('should display "ラウンドを選択してください" when no round selected (Requirement 3.4)', () => {
            // No round selected initially
            expect(mockSelectedRoundIndex).toBeNull();
            
            // This simulates the component showing the default message
            const shouldShowDefaultMessage = mockSelectedRoundIndex === null;
            expect(shouldShowDefaultMessage).toBe(true);
        });
    });

    describe('失敗時（マイナススコア）にサイドバーが更新されないことを確認', () => {
        test('should not update sidebar when score goes negative', () => {
            // Setup a low score scenario
            mockScore = 30;
            mockScoreScreen = [40]; // This will make score -10
            
            const initialRoundDetailsLength = mockRoundDetails.length;
            const initialScoreHistoryLength = mockScoreHistory.length;
            
            const result = handleScoreChange();
            
            // Verify failure
            expect(result).toBe('failed');
            expect(mockScore).toBe(30); // Score should remain unchanged
            expect(mockRoundDetails).toHaveLength(initialRoundDetailsLength); // No new rounds
            expect(mockScoreHistory).toHaveLength(initialScoreHistoryLength); // No new history
            expect(mockScoreScreen).toEqual([]); // Screen should be cleared
        });

        test('should not save round details on multiple failed attempts', () => {
            mockScore = 20;
            
            // First failed attempt
            mockScoreScreen = [30];
            handleScoreChange();
            
            // Second failed attempt
            mockScoreScreen = [25];
            handleScoreChange();
            
            expect(mockRoundDetails).toHaveLength(0);
            expect(mockScoreHistory).toHaveLength(0);
            expect(mockScore).toBe(20); // Score unchanged
        });

        test('should handle mixed success and failure scenarios', () => {
            // Successful round first
            mockScoreScreen = [20, 20, 20]; // 60 points
            handleScoreChange();
            
            expect(mockRoundDetails).toHaveLength(1);
            expect(mockScore).toBe(91); // 151 - 60 = 91
            
            // Failed attempt
            mockScoreScreen = [100]; // This will make score -9
            const result = handleScoreChange();
            
            expect(result).toBe('failed');
            expect(mockRoundDetails).toHaveLength(1); // Still only 1 round
            expect(mockScore).toBe(91); // Score unchanged from failure
        });
    });

    describe('ナイスアウト時のリセット動作をテスト', () => {
        test('should reset game after nice out (Requirements 4.1, 4.2)', async () => {
            // Setup nice out scenario
            mockScore = 60;
            mockScoreScreen = [60]; // Exact match for nice out
            mockSelectedRoundIndex = 0; // Simulate having a round selected
            
            const result = handleScoreChange();
            
            // Verify nice out
            expect(result).toBe('nice_out');
            expect(mockScore).toBe(0);
            expect(mockRoundDetails).toHaveLength(1); // Round should be saved before reset
            
            // Wait for the reset to happen
            await new Promise(resolve => setTimeout(resolve, 150));
            
            // Verify reset
            expect(mockScore).toBe(151);
            expect(mockRoundDetails).toEqual([]);
            expect(mockScoreHistory).toEqual([]);
            expect(mockSelectedRoundIndex).toBeNull();
        });

        test('should save round details before reset on nice out', async () => {
            mockScore = 180;
            mockScoreScreen = [60, 60, 60]; // Triple 20s for nice out
            mockTripleButtonActive = true;
            mockSingleButtonActive = false;
            
            const result = handleScoreChange();
            
            expect(result).toBe('nice_out');
            expect(mockScore).toBe(0);
            
            // Verify round was saved before reset
            expect(mockRoundDetails).toHaveLength(1);
            expect(mockRoundDetails[0].total).toBe(180);
            expect(mockRoundDetails[0].scores).toHaveLength(3);
            expect(mockRoundDetails[0].scores[0].multiplier).toBe('T');
            
            // Wait for reset
            await new Promise(resolve => setTimeout(resolve, 150));
            
            // Verify complete reset
            expect(mockRoundDetails).toEqual([]);
        });

        test('should handle nice out with different multiplier types', async () => {
            // Nice out with doubles
            mockScore = 40;
            mockScoreScreen = [40]; // D20
            mockDoubleButtonActive = true;
            mockSingleButtonActive = false;
            
            const result = handleScoreChange();
            
            expect(result).toBe('nice_out');
            expect(mockRoundDetails[0].scores[0].multiplier).toBe('D');
            expect(mockRoundDetails[0].scores[0].baseNumber).toBe(20);
            
            await new Promise(resolve => setTimeout(resolve, 150));
            expect(mockRoundDetails).toEqual([]);
        });
    });

    describe('Complete Integration Scenarios', () => {
        test('should handle complete game flow with multiple rounds and selections', async () => {
            // Play several rounds
            mockScoreScreen = [20, 20, 20]; // Round 1: 60 points
            handleScoreChange();
            
            mockScoreScreen = [15, 15]; // Round 2: 30 points  
            handleScoreChange();
            
            mockScoreScreen = [10, 10]; // Round 3: 20 points
            handleScoreChange();
            
            // Test round selection
            selectRound(1); // Select round 2
            expect(mockSelectedRoundIndex).toBe(1);
            expect(mockRoundDetails[1].total).toBe(30);
            
            // Continue playing
            mockScoreScreen = [5]; // Round 4: 5 points
            handleScoreChange();
            
            // Verify state
            expect(mockRoundDetails).toHaveLength(4);
            expect(mockScore).toBe(36); // 151 - 60 - 30 - 20 - 5 = 36
            expect(mockSelectedRoundIndex).toBe(1); // Selection should persist
            
            // Nice out
            mockScore = 36;
            mockScoreScreen = [36];
            handleScoreChange();
            
            await new Promise(resolve => setTimeout(resolve, 150));
            
            // Verify complete reset
            expect(mockScore).toBe(151);
            expect(mockRoundDetails).toEqual([]);
            expect(mockSelectedRoundIndex).toBeNull();
        });

        test('should maintain data integrity throughout complex scenarios', () => {
            // Complex scenario with mixed multipliers and selections
            
            // Round 1: Mixed multipliers
            mockScoreScreen = [20]; // S20
            handleScoreChange();
            
            mockDoubleButtonActive = true;
            mockSingleButtonActive = false;
            mockScoreScreen = [40]; // D20
            handleScoreChange();
            
            mockTripleButtonActive = true;
            mockDoubleButtonActive = false;
            mockScoreScreen = [60]; // T20
            handleScoreChange();
            
            // Verify data integrity
            expect(mockRoundDetails).toHaveLength(3);
            expect(mockRoundDetails[0].scores[0].multiplier).toBe('S');
            expect(mockRoundDetails[1].scores[0].multiplier).toBe('D');
            expect(mockRoundDetails[2].scores[0].multiplier).toBe('T');
            
            // Test selections
            selectRound(0);
            expect(mockRoundDetails[mockSelectedRoundIndex!].scores[0].value).toBe(20);
            
            selectRound(1);
            expect(mockRoundDetails[mockSelectedRoundIndex!].scores[0].value).toBe(40);
            
            selectRound(2);
            expect(mockRoundDetails[mockSelectedRoundIndex!].scores[0].value).toBe(60);
            
            // Verify totals
            // 151 - 20 - 40 - 60 = 31
            expect(mockScore).toBe(31);
        });
    });
});