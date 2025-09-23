/**
 * Main Application Class
 * Orchestrates all modules and handles application lifecycle
 */
import { CONFIG, DEFAULT_FORM_DATA, SCORE_UTILS } from './config.js';
import { ValidationService } from './validation.js';
import { StorageService } from './storage.js';
import { UIManager } from './ui-manager.js';
import { ScoreManager } from './score-manager.js';
import { FileManager } from './file-manager.js';
import { PT_STRINGS, ERROR_MESSAGES, SUCCESS_MESSAGES, KEYBOARD_SHORTCUTS } from '../constants.js';

export class InterviewScoreCardApp {
    /**
     * Initialize the application
     */
    constructor() {
        this.uiManager = new UIManager();
        this.scoreManager = new ScoreManager();
        this.isInitialized = false;
        this.autoSaveTimer = null;
        
        this.init();
    }
    
    /**
     * Initialize the application
     */
    async init() {
        try {
            // Check if localStorage is available
            if (!StorageService.isAvailable()) {
                this.uiManager.showMessage(ERROR_MESSAGES.STORAGE_UNAVAILABLE, 'error');
                return;
            }
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Load saved form data
            this.loadFormData();
            
            // Set current date
            this.uiManager.setCurrentDate();
            
            // Update scores display
            this.updateScores();
            
            // Setup auto-save if enabled
            if (CONFIG.UI.AUTO_SAVE) {
                this.setupAutoSave();
            }
            
            this.isInitialized = true;
            console.log('Application initialized successfully');
        } catch (error) {
            console.error('Error initializing application:', error);
            this.uiManager.showMessage('Erro ao inicializar aplicação', 'error');
        }
    }
    
    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Checkbox change listeners
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.handleScoreChange());
        });
        
        // Form input listeners for auto-save
        document.querySelectorAll('input[type="text"], input[type="date"], textarea').forEach(input => {
            input.addEventListener('input', this.debounce(() => this.saveFormData(), CONFIG.UI.DEBOUNCE_DELAY));
        });
        
        // Button listeners
        this.setupButtonListeners();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Add tooltips
        this.setupTooltips();
    }
    
    /**
     * Setup button event listeners
     */
    setupButtonListeners() {
        const buttons = {
            'saveScore': () => this.saveScore(),
            'loadScores': () => this.loadScores(),
            'clearForm': () => this.clearForm(),
            'exportScore': () => this.exportScore(),
            'importScore': () => this.triggerImport()
        };
        
        Object.entries(buttons).forEach(([id, handler]) => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', handler);
            }
        });
        
        // File input listener
        const importFile = document.getElementById('importFile');
        if (importFile) {
            importFile.addEventListener('change', (e) => this.importScore(e));
        }
    }
    
    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + S for save
            if ((e.ctrlKey || e.metaKey) && e.key === KEYBOARD_SHORTCUTS.SAVE.key) {
                e.preventDefault();
                this.saveScore();
            }
            
            // Ctrl/Cmd + E for export
            if ((e.ctrlKey || e.metaKey) && e.key === KEYBOARD_SHORTCUTS.EXPORT.key) {
                e.preventDefault();
                this.exportScore();
            }
            
            // Ctrl/Cmd + L for load scores
            if ((e.ctrlKey || e.metaKey) && e.key === KEYBOARD_SHORTCUTS.LOAD.key) {
                e.preventDefault();
                this.loadScores();
            }
        });
    }
    
    /**
     * Setup tooltips for buttons
     */
    setupTooltips() {
        const tooltips = {
            'saveScore': PT_STRINGS.SAVE_TOOLTIP,
            'loadScores': PT_STRINGS.LOAD_TOOLTIP,
            'clearForm': PT_STRINGS.CLEAR_TOOLTIP,
            'exportScore': PT_STRINGS.EXPORT_TOOLTIP,
            'importScore': PT_STRINGS.IMPORT_TOOLTIP
        };
        
        Object.entries(tooltips).forEach(([id, text]) => {
            const element = document.getElementById(id);
            if (element) {
                this.uiManager.addTooltip(element, text);
            }
        });
    }
    
    /**
     * Handle score changes
     */
    handleScoreChange() {
        const checkedItems = this.uiManager.getCheckedItems();
        this.scoreManager.calculateScores(checkedItems);
        this.updateScores();
        this.saveFormData();
    }
    
    /**
     * Update scores display
     */
    updateScores() {
        const scores = this.scoreManager.getScores();
        const maxScores = this.scoreManager.getMaxScores();
        this.uiManager.updateScoreDisplay(scores, maxScores);
    }
    
    /**
     * Save form data to localStorage
     */
    saveFormData() {
        try {
            const formData = {
                candidateName: this.uiManager.getFieldValue('candidateName'),
                interviewDate: this.uiManager.getFieldValue('interviewDate'),
                position: this.uiManager.getFieldValue('position'),
                interviewer: this.uiManager.getFieldValue('interviewer'),
                notes: this.uiManager.getFieldValue('notes'),
                checkedItems: this.uiManager.getCheckedItems()
            };
            
            StorageService.saveFormData(formData);
        } catch (error) {
            console.error('Error saving form data:', error);
        }
    }
    
    /**
     * Load form data from localStorage
     */
    loadFormData() {
        try {
            const savedData = StorageService.loadFormData();
            if (savedData) {
                // Load form fields
                this.uiManager.setFieldValue('candidateName', savedData.candidateName);
                this.uiManager.setFieldValue('interviewDate', savedData.interviewDate);
                this.uiManager.setFieldValue('position', savedData.position);
                this.uiManager.setFieldValue('interviewer', savedData.interviewer);
                this.uiManager.setFieldValue('notes', savedData.notes);
                
                // Restore checked items
                if (savedData.checkedItems && Array.isArray(savedData.checkedItems)) {
                    this.uiManager.clearAllCheckboxes();
                    savedData.checkedItems.forEach(item => {
                        this.uiManager.setCheckboxState(item.category, item.weight, item.text, true);
                    });
                }
            }
        } catch (error) {
            console.error('Error loading form data:', error);
        }
    }
    
    /**
     * Save score to localStorage
     */
    async saveScore() {
        try {
            const candidateName = this.uiManager.getFieldValue('candidateName').trim();
            
            // Validate candidate name
            const nameValidation = ValidationService.validateCandidateName(candidateName);
            if (!nameValidation.isValid) {
                this.uiManager.showMessage(nameValidation.message, 'error');
                return;
            }
            
            // Get all form data
            const formData = {
                candidateName,
                interviewDate: this.uiManager.getFieldValue('interviewDate'),
                position: this.uiManager.getFieldValue('position'),
                interviewer: this.uiManager.getFieldValue('interviewer'),
                notes: this.uiManager.getFieldValue('notes')
            };
            
            // Validate form data
            const validation = ValidationService.validateFormData(formData);
            if (!validation.isValid) {
                this.uiManager.showMessage(validation.errors.join(', '), 'error');
                return;
            }
            
            // Show warnings if any
            if (validation.warnings.length > 0) {
                this.uiManager.showMessage(validation.warnings.join(', '), 'warning');
            }
            
            // Create score data
            const scoreData = {
                id: Date.now().toString(),
                ...formData,
                scores: this.scoreManager.getScores(),
                maxScores: this.scoreManager.getMaxScores(),
                totalScore: this.scoreManager.getTotalScore(),
                maxTotalScore: this.scoreManager.getMaxTotalScore(),
                checkedItems: this.uiManager.getCheckedItems(),
                timestamp: new Date().toISOString()
            };
            
            // Save to storage
            const success = StorageService.saveScore(scoreData);
            if (success) {
                this.uiManager.showMessage(PT_STRINGS.SCORE_SAVED_SUCCESS, 'success');
            } else {
                throw new Error('Failed to save score');
            }
        } catch (error) {
            console.error('Error saving score:', error);
            this.uiManager.showMessage(ERROR_MESSAGES.OPERATION_FAILED, 'error');
        }
    }
    
    /**
     * Load and display saved scores
     */
    loadScores() {
        try {
            const savedScores = StorageService.getAllScores();
            this.uiManager.renderSavedScores(savedScores);
            this.uiManager.toggleSavedScores(true);
        } catch (error) {
            console.error('Error loading scores:', error);
            this.uiManager.showMessage(ERROR_MESSAGES.OPERATION_FAILED, 'error');
        }
    }
    
    /**
     * Load specific score data
     * @param {string} scoreId - Score ID to load
     */
    loadScoreData(scoreId) {
        try {
            const score = StorageService.getScoreById(scoreId);
            if (!score) {
                this.uiManager.showMessage(PT_STRINGS.SCORE_NOT_FOUND, 'error');
                return;
            }
            
            // Load form data
            this.uiManager.setFieldValue('candidateName', score.candidateName);
            this.uiManager.setFieldValue('interviewDate', score.interviewDate);
            this.uiManager.setFieldValue('position', score.position);
            this.uiManager.setFieldValue('interviewer', score.interviewer);
            this.uiManager.setFieldValue('notes', score.notes);
            
            // Clear all checkboxes first
            this.uiManager.clearAllCheckboxes();
            
            // Restore checked items
            if (score.checkedItems && Array.isArray(score.checkedItems)) {
                score.checkedItems.forEach(item => {
                    this.uiManager.setCheckboxState(item.category, item.weight, item.text, true);
                });
            }
            
            // Update scores
            this.scoreManager.setScores(score.scores);
            this.updateScores();
            
            this.uiManager.showMessage(PT_STRINGS.FORM_DATA_LOADED, 'success');
        } catch (error) {
            console.error('Error loading score data:', error);
            this.uiManager.showMessage(ERROR_MESSAGES.OPERATION_FAILED, 'error');
        }
    }
    
    /**
     * Delete score
     * @param {string} scoreId - Score ID to delete
     */
    deleteScore(scoreId) {
        try {
            if (confirm(PT_STRINGS.DELETE_CONFIRM)) {
                const success = StorageService.deleteScore(scoreId);
                if (success) {
                    this.loadScores(); // Refresh the display
                    this.uiManager.showMessage(PT_STRINGS.SCORE_DELETED_SUCCESS, 'success');
                } else {
                    throw new Error('Failed to delete score');
                }
            }
        } catch (error) {
            console.error('Error deleting score:', error);
            this.uiManager.showMessage(ERROR_MESSAGES.OPERATION_FAILED, 'error');
        }
    }
    
    /**
     * Clear form
     */
    clearForm() {
        try {
            if (confirm(PT_STRINGS.CLEAR_FORM_CONFIRM)) {
                // Clear form fields
                this.uiManager.setFieldValue('candidateName', '');
                this.uiManager.setFieldValue('interviewDate', '');
                this.uiManager.setFieldValue('position', '');
                this.uiManager.setFieldValue('interviewer', '');
                this.uiManager.setFieldValue('notes', '');
                
                // Clear checkboxes
                this.uiManager.clearAllCheckboxes();
                
                // Reset scores
                this.scoreManager.resetScores();
                this.updateScores();
                
                // Set current date
                this.uiManager.setCurrentDate();
                
                // Clear saved form data
                StorageService.clearFormData();
                
                this.uiManager.showMessage(PT_STRINGS.FORM_CLEARED_SUCCESS, 'success');
            }
        } catch (error) {
            console.error('Error clearing form:', error);
            this.uiManager.showMessage(ERROR_MESSAGES.OPERATION_FAILED, 'error');
        }
    }
    
    /**
     * Export score data
     */
    async exportScore() {
        try {
            const candidateName = this.uiManager.getFieldValue('candidateName').trim();
            
            if (!candidateName) {
                this.uiManager.showMessage(PT_STRINGS.ENTER_NAME_EXPORT, 'error');
                return;
            }
            
            // Create export data
            const checkedItems = this.uiManager.getCheckedItems();
            console.log('Exporting checked items:', checkedItems);
            
            const exportData = {
                candidateName,
                interviewDate: this.uiManager.getFieldValue('interviewDate'),
                position: this.uiManager.getFieldValue('position'),
                interviewer: this.uiManager.getFieldValue('interviewer'),
                scores: this.scoreManager.getScores(),
                maxScores: this.scoreManager.getMaxScores(),
                totalScore: this.scoreManager.getTotalScore(),
                maxTotalScore: this.scoreManager.getMaxTotalScore(),
                percentage: this.scoreManager.getPercentage(),
                notes: this.uiManager.getFieldValue('notes'),
                checkedItems: checkedItems
            };
            
            await FileManager.exportScore(exportData, candidateName);
            this.uiManager.showMessage(PT_STRINGS.SCORE_EXPORTED_SUCCESS, 'success');
        } catch (error) {
            console.error('Error exporting score:', error);
            this.uiManager.showMessage(error.message || ERROR_MESSAGES.OPERATION_FAILED, 'error');
        }
    }
    
    /**
     * Trigger file import dialog
     */
    triggerImport() {
        const importFile = document.getElementById('importFile');
        if (importFile) {
            importFile.click();
        }
    }
    
    /**
     * Import score from file
     * @param {Event} event - File input change event
     */
    async importScore(event) {
        try {
            const file = event.target.files[0];
            if (!file) return;
            
            // Import file data
            const importedData = await FileManager.importScore(file);
            
            // Validate imported data
            const validation = FileManager.validateImportedData(importedData);
            if (!validation.isValid) {
                this.uiManager.showMessage(validation.message, 'error');
                return;
            }
            
            // Load imported data
            this.loadImportedData(importedData);
            
            // Reset file input
            event.target.value = '';
        } catch (error) {
            console.error('Error importing score:', error);
            this.uiManager.showMessage(error.message || PT_STRINGS.IMPORT_ERROR, 'error');
        }
    }
    
    /**
     * Load imported data into the form
     * @param {Object} data - Imported data
     */
    loadImportedData(data) {
        try {
            console.log('Loading imported data:', data);
            
            // Load candidate information
            this.uiManager.setFieldValue('candidateName', data.candidateName || '');
            this.uiManager.setFieldValue('interviewDate', data.interviewDate || '');
            this.uiManager.setFieldValue('position', data.position || '');
            this.uiManager.setFieldValue('interviewer', data.interviewer || '');
            this.uiManager.setFieldValue('notes', data.notes || '');
            
            // Clear all checkboxes first
            this.uiManager.clearAllCheckboxes();
            
            // Restore checked items
            if (data.checkedItems && Array.isArray(data.checkedItems)) {
                console.log('Restoring checked items:', data.checkedItems);
                data.checkedItems.forEach(item => {
                    console.log('Setting checkbox state:', item);
                    this.uiManager.setCheckboxState(item.category, item.weight, item.text, true);
                });
            } else {
                console.log('No checked items found in imported data');
            }
            
            // Update scores
            this.scoreManager.setScores(data.scores);
            this.updateScores();
            
            this.uiManager.showMessage(PT_STRINGS.IMPORT_SUCCESS, 'success');
        } catch (error) {
            console.error('Error loading imported data:', error);
            this.uiManager.showMessage(PT_STRINGS.IMPORT_INVALID_FORMAT, 'error');
        }
    }
    
    /**
     * Setup auto-save functionality
     */
    setupAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
        }
        
        this.autoSaveTimer = setInterval(() => {
            this.saveFormData();
        }, CONFIG.UI.AUTO_SAVE_INTERVAL);
    }
    
    /**
     * Debounce function to limit function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * Cleanup resources
     */
    destroy() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
        }
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeydown);
        
        console.log('Application destroyed');
    }
}
