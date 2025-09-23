/**
 * Validation utilities for form data and user input
 */
import { CONFIG } from './config.js';

export class ValidationService {
    /**
     * Validate candidate name
     * @param {string} name - Candidate name
     * @returns {Object} Validation result with isValid and message
     */
    static validateCandidateName(name) {
        if (!name || typeof name !== 'string') {
            return {
                isValid: false,
                message: 'Nome do candidato é obrigatório'
            };
        }
        
        const trimmedName = name.trim();
        
        if (trimmedName.length < CONFIG.VALIDATION.MIN_NAME_LENGTH) {
            return {
                isValid: false,
                message: 'Nome do candidato deve ter pelo menos 1 caractere'
            };
        }
        
        if (trimmedName.length > CONFIG.VALIDATION.MAX_NAME_LENGTH) {
            return {
                isValid: false,
                message: `Nome do candidato deve ter no máximo ${CONFIG.VALIDATION.MAX_NAME_LENGTH} caracteres`
            };
        }
        
        return {
            isValid: true,
            message: 'Nome válido'
        };
    }
    
    /**
     * Validate interview date
     * @param {string} date - Interview date in YYYY-MM-DD format
     * @returns {Object} Validation result
     */
    static validateInterviewDate(date) {
        if (!date) {
            return {
                isValid: false,
                message: 'Data da entrevista é obrigatória'
            };
        }
        
        const dateObj = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (isNaN(dateObj.getTime())) {
            return {
                isValid: false,
                message: 'Data inválida'
            };
        }
        
        if (dateObj > today) {
            return {
                isValid: false,
                message: 'Data da entrevista não pode ser no futuro'
            };
        }
        
        return {
            isValid: true,
            message: 'Data válida'
        };
    }
    
    /**
     * Validate notes
     * @param {string} notes - Additional notes
     * @returns {Object} Validation result
     */
    static validateNotes(notes) {
        if (!notes) {
            return {
                isValid: true,
                message: 'Notas opcionais'
            };
        }
        
        if (notes.length > CONFIG.VALIDATION.MAX_NOTES_LENGTH) {
            return {
                isValid: false,
                message: `Notas devem ter no máximo ${CONFIG.VALIDATION.MAX_NOTES_LENGTH} caracteres`
            };
        }
        
        return {
            isValid: true,
            message: 'Notas válidas'
        };
    }
    
    /**
     * Validate form data object
     * @param {Object} formData - Complete form data
     * @returns {Object} Validation result with details
     */
    static validateFormData(formData) {
        const errors = [];
        const warnings = [];
        
        // Validate candidate name
        const nameValidation = this.validateCandidateName(formData.candidateName);
        if (!nameValidation.isValid) {
            errors.push(nameValidation.message);
        }
        
        // Validate interview date
        const dateValidation = this.validateInterviewDate(formData.interviewDate);
        if (!dateValidation.isValid) {
            errors.push(dateValidation.message);
        }
        
        // Validate notes
        const notesValidation = this.validateNotes(formData.notes);
        if (!notesValidation.isValid) {
            errors.push(notesValidation.message);
        }
        
        // Check if position is provided
        if (!formData.position || formData.position.trim().length === 0) {
            warnings.push('Cargo não especificado');
        }
        
        // Check if interviewer is provided
        if (!formData.interviewer || formData.interviewer.trim().length === 0) {
            warnings.push('Entrevistador não especificado');
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }
    
    /**
     * Validate imported data structure
     * @param {Object} data - Imported data
     * @returns {Object} Validation result
     */
    static validateImportedData(data) {
        if (!data || typeof data !== 'object') {
            return {
                isValid: false,
                message: 'Dados inválidos: não é um objeto'
            };
        }
        
        const requiredFields = ['candidateName', 'scores', 'maxScores', 'totalScore'];
        const missingFields = requiredFields.filter(field => !(field in data));
        
        if (missingFields.length > 0) {
            return {
                isValid: false,
                message: `Dados inválidos: campos obrigatórios ausentes: ${missingFields.join(', ')}`
            };
        }
        
        // Validate scores structure
        if (!this.validateScoresStructure(data.scores, data.maxScores)) {
            return {
                isValid: false,
                message: 'Estrutura de pontuações inválida'
            };
        }
        
        return {
            isValid: true,
            message: 'Dados válidos'
        };
    }
    
    /**
     * Validate scores structure
     * @param {Object} scores - Current scores
     * @param {Object} maxScores - Maximum scores
     * @returns {boolean} Whether structure is valid
     */
    static validateScoresStructure(scores, maxScores) {
        const categories = Object.keys(CONFIG.SCORE_CATEGORIES);
        
        // Check if all categories are present
        for (const category of categories) {
            if (!(category in scores) || !(category in maxScores)) {
                return false;
            }
            
            // Check if scores are numbers
            if (typeof scores[category] !== 'number' || typeof maxScores[category] !== 'number') {
                return false;
            }
            
            // Check if scores are within valid range
            if (scores[category] < 0 || scores[category] > maxScores[category]) {
                return false;
            }
        }
        
        return true;
    }
}
