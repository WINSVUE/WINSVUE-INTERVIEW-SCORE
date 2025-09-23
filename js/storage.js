/**
 * Local Storage management service
 * Handles all data persistence operations
 */
import { CONFIG } from './config.js';

export class StorageService {
    /**
     * Save form data to localStorage
     * @param {Object} formData - Form data to save
     * @returns {boolean} Success status
     */
    static saveFormData(formData) {
        try {
            const serializedData = JSON.stringify(formData);
            localStorage.setItem(CONFIG.STORAGE_KEYS.FORM_DATA, serializedData);
            return true;
        } catch (error) {
            console.error('Error saving form data:', error);
            return false;
        }
    }
    
    /**
     * Load form data from localStorage
     * @returns {Object|null} Form data or null if not found
     */
    static loadFormData() {
        try {
            const serializedData = localStorage.getItem(CONFIG.STORAGE_KEYS.FORM_DATA);
            return serializedData ? JSON.parse(serializedData) : null;
        } catch (error) {
            console.error('Error loading form data:', error);
            return null;
        }
    }
    
    /**
     * Clear form data from localStorage
     * @returns {boolean} Success status
     */
    static clearFormData() {
        try {
            localStorage.removeItem(CONFIG.STORAGE_KEYS.FORM_DATA);
            return true;
        } catch (error) {
            console.error('Error clearing form data:', error);
            return false;
        }
    }
    
    /**
     * Save score data to localStorage
     * @param {Object} scoreData - Score data to save
     * @returns {boolean} Success status
     */
    static saveScore(scoreData) {
        try {
            const existingScores = this.getAllScores();
            existingScores.push(scoreData);
            
            const serializedData = JSON.stringify(existingScores);
            localStorage.setItem(CONFIG.STORAGE_KEYS.SCORES, serializedData);
            return true;
        } catch (error) {
            console.error('Error saving score:', error);
            return false;
        }
    }
    
    /**
     * Get all saved scores
     * @returns {Array} Array of saved scores
     */
    static getAllScores() {
        try {
            const serializedData = localStorage.getItem(CONFIG.STORAGE_KEYS.SCORES);
            return serializedData ? JSON.parse(serializedData) : [];
        } catch (error) {
            console.error('Error loading scores:', error);
            return [];
        }
    }
    
    /**
     * Get score by ID
     * @param {string} scoreId - Score ID
     * @returns {Object|null} Score data or null if not found
     */
    static getScoreById(scoreId) {
        try {
            const scores = this.getAllScores();
            return scores.find(score => score.id === scoreId) || null;
        } catch (error) {
            console.error('Error getting score by ID:', error);
            return null;
        }
    }
    
    /**
     * Delete score by ID
     * @param {string} scoreId - Score ID to delete
     * @returns {boolean} Success status
     */
    static deleteScore(scoreId) {
        try {
            const scores = this.getAllScores();
            const updatedScores = scores.filter(score => score.id !== scoreId);
            
            const serializedData = JSON.stringify(updatedScores);
            localStorage.setItem(CONFIG.STORAGE_KEYS.SCORES, serializedData);
            return true;
        } catch (error) {
            console.error('Error deleting score:', error);
            return false;
        }
    }
    
    /**
     * Clear all scores
     * @returns {boolean} Success status
     */
    static clearAllScores() {
        try {
            localStorage.removeItem(CONFIG.STORAGE_KEYS.SCORES);
            return true;
        } catch (error) {
            console.error('Error clearing all scores:', error);
            return false;
        }
    }
    
    /**
     * Get storage usage information
     * @returns {Object} Storage usage stats
     */
    static getStorageInfo() {
        try {
            const formData = localStorage.getItem(CONFIG.STORAGE_KEYS.FORM_DATA);
            const scores = localStorage.getItem(CONFIG.STORAGE_KEYS.SCORES);
            
            return {
                formDataSize: formData ? formData.length : 0,
                scoresSize: scores ? scores.length : 0,
                totalSize: (formData ? formData.length : 0) + (scores ? scores.length : 0),
                scoresCount: this.getAllScores().length
            };
        } catch (error) {
            console.error('Error getting storage info:', error);
            return {
                formDataSize: 0,
                scoresSize: 0,
                totalSize: 0,
                scoresCount: 0
            };
        }
    }
    
    /**
     * Check if localStorage is available
     * @returns {boolean} Whether localStorage is available
     */
    static isAvailable() {
        try {
            const testKey = '__storage_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    }
}
