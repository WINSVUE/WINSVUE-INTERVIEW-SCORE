/**
 * Application Configuration
 * Contains all configuration constants and settings
 */
export const CONFIG = {
    // Application metadata
    APP_NAME: 'Interview Score Card',
    VERSION: '1.0.0',
    
    // Storage keys
    STORAGE_KEYS: {
        FORM_DATA: 'interviewFormData',
        SCORES: 'interviewScores'
    },
    
    // Score categories and their maximum possible scores
    SCORE_CATEGORIES: {
        'code-quality': {
            name: 'Qualidade do Código',
            maxScore: 16,
            weight: 1
        },
        'architecture': {
            name: 'Arquitetura',
            maxScore: 17,
            weight: 1
        },
        'problem-solving': {
            name: 'Resolução de Problemas',
            maxScore: 17,
            weight: 1
        },
        'technical': {
            name: 'Conhecimento Técnico',
            maxScore: 15,
            weight: 1
        },
        'communication': {
            name: 'Comunicação',
            maxScore: 10,
            weight: 1
        }
    },
    
    // UI settings
    UI: {
        MESSAGE_DISPLAY_DURATION: 5000,
        ANIMATION_DURATION: 300,
        DEBOUNCE_DELAY: 300,
        AUTO_SAVE: true,
        AUTO_SAVE_INTERVAL: 30000,
        AUTO_LOAD_FORM_DATA: false // Changed to false to prevent unwanted checkbox persistence
    },
    
    // File settings
    FILE: {
        EXPORT_PREFIX: 'pontuacao-entrevista',
        ACCEPTED_EXTENSIONS: ['.json'],
        MIME_TYPE: 'application/json'
    },
    
    // Validation rules
    VALIDATION: {
        MIN_NAME_LENGTH: 1,
        MAX_NAME_LENGTH: 100,
        MAX_NOTES_LENGTH: 1000
    }
};

/**
 * Default form data structure
 */
export const DEFAULT_FORM_DATA = {
    candidateName: '',
    interviewDate: '',
    position: '',
    interviewer: '',
    notes: '',
    checkedItems: []
};

/**
 * Score calculation utilities
 */
export const SCORE_UTILS = {
    /**
     * Calculate total score from category scores
     * @param {Object} scores - Category scores object
     * @returns {number} Total score
     */
    calculateTotal(scores) {
        return Object.values(scores).reduce((sum, score) => sum + score, 0);
    },
    
    /**
     * Calculate maximum possible score
     * @returns {number} Maximum possible score
     */
    calculateMaxTotal() {
        return Object.values(CONFIG.SCORE_CATEGORIES)
            .reduce((sum, category) => sum + category.maxScore, 0);
    },
    
    /**
     * Calculate percentage score
     * @param {number} currentScore - Current score
     * @param {number} maxScore - Maximum possible score
     * @returns {number} Percentage (0-100)
     */
    calculatePercentage(currentScore, maxScore) {
        return Math.round((currentScore / maxScore) * 100);
    },
    
    /**
     * Get score color based on percentage
     * @param {number} percentage - Score percentage
     * @returns {string} CSS color value
     */
    getScoreColor(percentage) {
        if (percentage >= 80) return '#28a745';
        if (percentage >= 60) return '#ffc107';
        return '#dc3545';
    }
};
