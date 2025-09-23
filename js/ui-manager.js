/**
 * UI Management service
 * Handles all DOM manipulation and UI interactions
 */
import { CONFIG } from './config.js';
import { PT_STRINGS } from '../constants.js';
import { SCORE_UTILS } from './config.js';

export class UIManager {
    constructor() {
        this.messageContainer = null;
        this.initializeMessageContainer();
    }
    
    /**
     * Initialize message container for notifications
     */
    initializeMessageContainer() {
        this.messageContainer = document.createElement('div');
        this.messageContainer.className = 'message-container';
        this.messageContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            max-width: 400px;
        `;
        document.body.appendChild(this.messageContainer);
    }
    
    /**
     * Show message to user
     * @param {string} message - Message text
     * @param {string} type - Message type ('success', 'error', 'warning', 'info')
     * @param {number} duration - Display duration in milliseconds
     */
    showMessage(message, type = 'info', duration = CONFIG.UI.MESSAGE_DISPLAY_DURATION) {
        // Remove existing messages
        this.clearMessages();
        
        const messageElement = document.createElement('div');
        messageElement.className = `message message-${type}`;
        messageElement.textContent = message;
        
        // Add styles
        messageElement.style.cssText = `
            padding: 12px 16px;
            margin-bottom: 10px;
            border-radius: 6px;
            font-weight: 500;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            animation: slideIn 0.3s ease;
        `;
        
        // Set colors based on type
        const colors = {
            success: { bg: '#d4edda', color: '#155724', border: '#c3e6cb' },
            error: { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb' },
            warning: { bg: '#fff3cd', color: '#856404', border: '#ffeaa7' },
            info: { bg: '#d1ecf1', color: '#0c5460', border: '#bee5eb' }
        };
        
        const colorScheme = colors[type] || colors.info;
        messageElement.style.backgroundColor = colorScheme.bg;
        messageElement.style.color = colorScheme.color;
        messageElement.style.border = `1px solid ${colorScheme.border}`;
        
        this.messageContainer.appendChild(messageElement);
        
        // Auto-remove after duration
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (messageElement.parentNode) {
                        messageElement.remove();
                    }
                }, 300);
            }
        }, duration);
    }
    
    /**
     * Clear all messages
     */
    clearMessages() {
        if (this.messageContainer) {
            this.messageContainer.innerHTML = '';
        }
    }
    
    /**
     * Update score display
     * @param {Object} scores - Current scores
     * @param {Object} maxScores - Maximum scores
     */
    updateScoreDisplay(scores, maxScores) {
        const categories = Object.keys(CONFIG.SCORE_CATEGORIES);
        const displayNames = ['codeQuality', 'architecture', 'problemSolving', 'technical', 'communication'];
        
        categories.forEach((category, index) => {
            const scoreElement = document.getElementById(displayNames[index] + 'Score');
            if (scoreElement) {
                const currentScore = scores[category] || 0;
                const maxScore = maxScores[category] || 0;
                scoreElement.textContent = `${currentScore}/${maxScore}`;
                
                // Add animation
                this.animateScoreUpdate(scoreElement.parentElement);
            }
        });
        
        // Update total score
        this.updateTotalScore(scores, maxScores);
    }
    
    /**
     * Update total score display
     * @param {Object} scores - Current scores
     * @param {Object} maxScores - Maximum scores
     */
    updateTotalScore(scores, maxScores) {
        const totalScore = SCORE_UTILS.calculateTotal(scores);
        const maxTotalScore = SCORE_UTILS.calculateMaxTotal();
        const percentage = SCORE_UTILS.calculatePercentage(totalScore, maxTotalScore);
        
        const totalScoreElement = document.getElementById('totalScore');
        const maxScoreElement = document.getElementById('maxScore');
        const percentageElement = document.getElementById('percentage');
        
        if (totalScoreElement) totalScoreElement.textContent = totalScore;
        if (maxScoreElement) maxScoreElement.textContent = maxTotalScore;
        if (percentageElement) {
            percentageElement.textContent = `${percentage}%`;
            percentageElement.style.color = SCORE_UTILS.getScoreColor(percentage);
        }
    }
    
    /**
     * Animate score update
     * @param {HTMLElement} element - Element to animate
     */
    animateScoreUpdate(element) {
        element.classList.add('updated');
        setTimeout(() => {
            element.classList.remove('updated');
        }, CONFIG.UI.ANIMATION_DURATION);
    }
    
    /**
     * Set form field value
     * @param {string} fieldId - Field ID
     * @param {string} value - Value to set
     */
    setFieldValue(fieldId, value) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = value || '';
        }
    }
    
    /**
     * Get form field value
     * @param {string} fieldId - Field ID
     * @returns {string} Field value
     */
    getFieldValue(fieldId) {
        const field = document.getElementById(fieldId);
        return field ? field.value : '';
    }
    
    /**
     * Set checkbox state
     * @param {string} category - Checkbox category
     * @param {number} weight - Checkbox weight
     * @param {string} text - Checkbox text
     * @param {boolean} checked - Whether checkbox should be checked
     */
    setCheckboxState(category, weight, text, checked) {
        console.log(`Setting checkbox state: category=${category}, weight=${weight}, text="${text}", checked=${checked}`);
        
        const checkboxes = document.querySelectorAll(`input[type="checkbox"][data-category="${category}"]`);
        console.log(`Found ${checkboxes.length} checkboxes for category ${category}`);
        
        checkboxes.forEach((checkbox, index) => {
            if (parseInt(checkbox.dataset.weight) === weight) {
                // Get the text from the label that contains this checkbox
                const label = checkbox.closest('label');
                const checkboxText = label ? label.textContent.trim() : checkbox.nextElementSibling.textContent.trim();
                
                console.log(`Checkbox ${index}: weight=${checkbox.dataset.weight}, text="${checkboxText}"`);
                
                // Match by text content (more reliable than just nextElementSibling)
                if (checkboxText === text) {
                    console.log(`Match found! Setting checkbox ${index} to ${checked}`);
                    checkbox.checked = checked;
                }
            }
        });
    }
    
    /**
     * Clear all checkboxes
     */
    clearAllCheckboxes() {
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
    }
    
    /**
     * Get all checked items
     * @returns {Array} Array of checked items with their data
     */
    getCheckedItems() {
        return Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => {
            // Get the text from the label that contains this checkbox
            const label = checkbox.closest('label');
            const text = label ? label.textContent.trim() : checkbox.nextElementSibling.textContent.trim();
            
            return {
                category: checkbox.dataset.category,
                weight: parseInt(checkbox.dataset.weight),
                text: text
            };
        });
    }
    
    /**
     * Set current date in date field
     */
    setCurrentDate() {
        const dateInput = document.getElementById('interviewDate');
        if (dateInput && !dateInput.value) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
    }
    
    /**
     * Show/hide saved scores section
     * @param {boolean} show - Whether to show the section
     */
    toggleSavedScores(show) {
        const scoresContainer = document.getElementById('savedScores');
        if (scoresContainer) {
            scoresContainer.style.display = show ? 'block' : 'none';
        }
    }
    
    /**
     * Render saved scores list
     * @param {Array} scores - Array of saved scores
     */
    renderSavedScores(scores) {
        const scoresList = document.getElementById('scoresList');
        if (!scoresList) return;
        
        if (scores.length === 0) {
            scoresList.innerHTML = `<p>${PT_STRINGS.NO_SAVED_SCORES}</p>`;
            return;
        }
        
        scoresList.innerHTML = scores
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map(score => this.createScoreItemHTML(score))
            .join('');
    }
    
    /**
     * Create HTML for a single score item
     * @param {Object} score - Score data
     * @returns {string} HTML string
     */
    createScoreItemHTML(score) {
        const percentage = SCORE_UTILS.calculatePercentage(score.totalScore, score.maxTotalScore);
        const date = new Date(score.timestamp).toLocaleDateString('pt-BR');
        const time = new Date(score.timestamp).toLocaleTimeString('pt-BR');
        
        return `
            <div class="saved-score-item">
                <h4>${this.escapeHtml(score.candidateName)}</h4>
                <div class="saved-score-meta">
                    <span><strong>${PT_STRINGS.POSITION_LABEL}</strong> ${this.escapeHtml(score.position || 'N/A')}</span>
                    <span><strong>${PT_STRINGS.DATE_LABEL}</strong> ${score.interviewDate || 'N/A'}</span>
                    <span><strong>${PT_STRINGS.INTERVIEWER_LABEL}</strong> ${this.escapeHtml(score.interviewer || 'N/A')}</span>
                    <span><strong>${PT_STRINGS.SAVED_LABEL}</strong> ${date} às ${time}</span>
                </div>
                <div class="saved-score-total">
                    Pontuação: ${score.totalScore}/${score.maxTotalScore} (${percentage}%)
                </div>
                ${score.notes ? `<p><strong>${PT_STRINGS.NOTES_LABEL}</strong> ${this.escapeHtml(score.notes)}</p>` : ''}
                <div style="margin-top: 10px;">
                    <button onclick="window.interviewScoreCard.loadScoreData('${score.id}')" 
                            class="btn btn-secondary" 
                            style="margin-right: 10px; padding: 8px 16px; font-size: 0.9rem;">
                        ${PT_STRINGS.LOAD_BUTTON}
                    </button>
                    <button onclick="window.interviewScoreCard.deleteScore('${score.id}')" 
                            class="btn btn-danger" 
                            style="padding: 8px 16px; font-size: 0.9rem;">
                        ${PT_STRINGS.DELETE_BUTTON}
                    </button>
                </div>
            </div>
        `;
    }
    
    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Add tooltip to element
     * @param {HTMLElement} element - Element to add tooltip to
     * @param {string} text - Tooltip text
     */
    addTooltip(element, text) {
        if (element) {
            element.title = text;
        }
    }
    
    /**
     * Set loading state for element
     * @param {HTMLElement} element - Element to set loading state for
     * @param {boolean} loading - Whether element should be in loading state
     */
    setLoadingState(element, loading) {
        if (element) {
            if (loading) {
                element.classList.add('loading');
                element.disabled = true;
            } else {
                element.classList.remove('loading');
                element.disabled = false;
            }
        }
    }
}
