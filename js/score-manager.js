/**
 * Score calculation and management service
 * Handles all score-related operations
 */
import { CONFIG } from './config.js';
import { SCORE_UTILS } from './config.js';

export class ScoreManager {
    constructor() {
        this.scores = this.initializeScores();
        this.maxScores = this.initializeMaxScores();
    }
    
    /**
     * Initialize scores object with default values
     * @returns {Object} Initialized scores object
     */
    initializeScores() {
        const scores = {};
        Object.keys(CONFIG.SCORE_CATEGORIES).forEach(category => {
            scores[category] = 0;
        });
        return scores;
    }
    
    /**
     * Initialize max scores object
     * @returns {Object} Initialized max scores object
     */
    initializeMaxScores() {
        const maxScores = {};
        Object.keys(CONFIG.SCORE_CATEGORIES).forEach(category => {
            maxScores[category] = CONFIG.SCORE_CATEGORIES[category].maxScore;
        });
        return maxScores;
    }
    
    /**
     * Calculate scores based on checked items
     * @param {Array} checkedItems - Array of checked items
     * @returns {Object} Updated scores object
     */
    calculateScores(checkedItems) {
        // Reset all scores
        this.scores = this.initializeScores();
        
        // Calculate scores based on checked items
        checkedItems.forEach(item => {
            if (this.scores.hasOwnProperty(item.category)) {
                this.scores[item.category] += item.weight;
            }
        });
        
        return { ...this.scores };
    }
    
    /**
     * Get current scores
     * @returns {Object} Current scores
     */
    getScores() {
        return { ...this.scores };
    }
    
    /**
     * Get max scores
     * @returns {Object} Max scores
     */
    getMaxScores() {
        return { ...this.maxScores };
    }
    
    /**
     * Get total score
     * @returns {number} Total score
     */
    getTotalScore() {
        return SCORE_UTILS.calculateTotal(this.scores);
    }
    
    /**
     * Get max total score
     * @returns {number} Max total score
     */
    getMaxTotalScore() {
        return SCORE_UTILS.calculateMaxTotal();
    }
    
    /**
     * Get percentage score
     * @returns {number} Percentage score
     */
    getPercentage() {
        return SCORE_UTILS.calculatePercentage(this.getTotalScore(), this.getMaxTotalScore());
    }
    
    /**
     * Get score breakdown by category
     * @returns {Array} Array of category score objects
     */
    getScoreBreakdown() {
        return Object.keys(CONFIG.SCORE_CATEGORIES).map(category => ({
            category,
            name: CONFIG.SCORE_CATEGORIES[category].name,
            score: this.scores[category],
            maxScore: this.maxScores[category],
            percentage: SCORE_UTILS.calculatePercentage(this.scores[category], this.maxScores[category])
        }));
    }
    
    /**
     * Get score statistics
     * @returns {Object} Score statistics
     */
    getScoreStatistics() {
        const totalScore = this.getTotalScore();
        const maxTotalScore = this.getMaxTotalScore();
        const percentage = this.getPercentage();
        
        return {
            totalScore,
            maxTotalScore,
            percentage,
            color: SCORE_UTILS.getScoreColor(percentage),
            breakdown: this.getScoreBreakdown(),
            grade: this.getGrade(percentage)
        };
    }
    
    /**
     * Get grade based on percentage
     * @param {number} percentage - Score percentage
     * @returns {string} Grade
     */
    getGrade(percentage) {
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B+';
        if (percentage >= 60) return 'B';
        if (percentage >= 50) return 'C+';
        if (percentage >= 40) return 'C';
        if (percentage >= 30) return 'D';
        return 'F';
    }
    
    /**
     * Reset all scores to zero
     */
    resetScores() {
        this.scores = this.initializeScores();
    }
    
    /**
     * Set scores from data (for loading/importing)
     * @param {Object} scoresData - Scores data to set
     */
    setScores(scoresData) {
        if (scoresData && typeof scoresData === 'object') {
            Object.keys(CONFIG.SCORE_CATEGORIES).forEach(category => {
                if (scoresData.hasOwnProperty(category)) {
                    this.scores[category] = scoresData[category] || 0;
                }
            });
        }
    }
    
    /**
     * Validate score data
     * @param {Object} scoresData - Scores data to validate
     * @returns {Object} Validation result
     */
    validateScoreData(scoresData) {
        if (!scoresData || typeof scoresData !== 'object') {
            return {
                isValid: false,
                message: 'Dados de pontuação inválidos'
            };
        }
        
        const categories = Object.keys(CONFIG.SCORE_CATEGORIES);
        const errors = [];
        
        for (const category of categories) {
            if (!(category in scoresData)) {
                errors.push(`Categoria '${category}' ausente`);
                continue;
            }
            
            const score = scoresData[category];
            if (typeof score !== 'number' || isNaN(score)) {
                errors.push(`Pontuação inválida para categoria '${category}'`);
                continue;
            }
            
            if (score < 0 || score > this.maxScores[category]) {
                errors.push(`Pontuação fora do range para categoria '${category}' (0-${this.maxScores[category]})`);
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            message: errors.length === 0 ? 'Dados válidos' : errors.join(', ')
        };
    }
}
