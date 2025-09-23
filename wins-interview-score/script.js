// Aplicação de Cartão de Avaliação de Entrevista
class InterviewScoreCard {
    constructor() {
        this.scores = {
            'code-quality': 0,
            'architecture': 0,
            'problem-solving': 0,
            'technical': 0,
            'communication': 0
        };
        
        this.maxScores = {
            'code-quality': 16,
            'architecture': 17,
            'problem-solving': 17,
            'technical': 15,
            'communication': 10
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadFormData();
        this.updateScores();
        this.setCurrentDate();
    }

    setupEventListeners() {
        // Checkbox change listeners
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateScores());
        });

        // Form input listeners for auto-save
        document.querySelectorAll('input[type="text"], input[type="date"], textarea').forEach(input => {
            input.addEventListener('input', () => this.saveFormData());
        });

        // Button listeners
        document.getElementById('saveScore').addEventListener('click', () => this.saveScore());
        document.getElementById('loadScores').addEventListener('click', () => this.loadScores());
        document.getElementById('clearForm').addEventListener('click', () => this.clearForm());
        document.getElementById('exportScore').addEventListener('click', () => this.exportScore());
    }

    setCurrentDate() {
        const dateInput = document.getElementById('interviewDate');
        if (!dateInput.value) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
    }

    updateScores() {
        // Reset all scores
        Object.keys(this.scores).forEach(category => {
            this.scores[category] = 0;
        });

        // Calculate scores based on checked items
        document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            const category = checkbox.dataset.category;
            const weight = parseInt(checkbox.dataset.weight);
            this.scores[category] += weight;
        });

        // Update display
        this.updateScoreDisplay();
        this.saveFormData();
    }

    updateScoreDisplay() {
        const categories = ['code-quality', 'architecture', 'problem-solving', 'technical', 'communication'];
        const displayNames = ['codeQuality', 'architecture', 'problemSolving', 'technical', 'communication'];
        
        categories.forEach((category, index) => {
            const scoreElement = document.getElementById(displayNames[index] + 'Score');
            if (scoreElement) {
                const currentScore = this.scores[category];
                const maxScore = this.maxScores[category];
                scoreElement.textContent = `${currentScore}/${maxScore}`;
                
                // Add animation class
                scoreElement.parentElement.classList.add('updated');
                setTimeout(() => {
                    scoreElement.parentElement.classList.remove('updated');
                }, 300);
            }
        });

        // Update total score
        const totalScore = Object.values(this.scores).reduce((sum, score) => sum + score, 0);
        const maxTotalScore = Object.values(this.maxScores).reduce((sum, score) => sum + score, 0);
        const percentage = Math.round((totalScore / maxTotalScore) * 100);

        document.getElementById('totalScore').textContent = totalScore;
        document.getElementById('maxScore').textContent = maxTotalScore;
        document.getElementById('percentage').textContent = `${percentage}%`;

        // Update percentage color based on score
        const percentageElement = document.getElementById('percentage');
        percentageElement.className = 'percentage';
        if (percentage >= 80) {
            percentageElement.style.color = '#28a745';
        } else if (percentage >= 60) {
            percentageElement.style.color = '#ffc107';
        } else {
            percentageElement.style.color = '#dc3545';
        }
    }

    saveFormData() {
        const formData = {
            candidateName: document.getElementById('candidateName').value,
            interviewDate: document.getElementById('interviewDate').value,
            position: document.getElementById('position').value,
            interviewer: document.getElementById('interviewer').value,
            notes: document.getElementById('notes').value,
            checkedItems: Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.id || cb.name)
        };

        localStorage.setItem('interviewFormData', JSON.stringify(formData));
    }

    loadFormData() {
        const savedData = localStorage.getItem('interviewFormData');
        if (savedData) {
            const formData = JSON.parse(savedData);
            
            document.getElementById('candidateName').value = formData.candidateName || '';
            document.getElementById('interviewDate').value = formData.interviewDate || '';
            document.getElementById('position').value = formData.position || '';
            document.getElementById('interviewer').value = formData.interviewer || '';
            document.getElementById('notes').value = formData.notes || '';

            // Restore checked items
            if (formData.checkedItems) {
                formData.checkedItems.forEach(itemId => {
                    const checkbox = document.querySelector(`input[type="checkbox"][data-category="${itemId}"]`) || 
                                   document.getElementById(itemId);
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                });
            }
        }
    }

    saveScore() {
        const candidateName = document.getElementById('candidateName').value.trim();
        if (!candidateName) {
            this.showMessage(PT_STRINGS.ENTER_CANDIDATE_NAME, 'error');
            return;
        }

        const scoreData = {
            id: Date.now().toString(),
            candidateName: candidateName,
            interviewDate: document.getElementById('interviewDate').value,
            position: document.getElementById('position').value,
            interviewer: document.getElementById('interviewer').value,
            scores: { ...this.scores },
            maxScores: { ...this.maxScores },
            totalScore: Object.values(this.scores).reduce((sum, score) => sum + score, 0),
            maxTotalScore: Object.values(this.maxScores).reduce((sum, score) => sum + score, 0),
            notes: document.getElementById('notes').value,
            timestamp: new Date().toISOString()
        };

        // Get existing scores
        const existingScores = JSON.parse(localStorage.getItem('interviewScores') || '[]');
        
        // Add new score
        existingScores.push(scoreData);
        
        // Save back to localStorage
        localStorage.setItem('interviewScores', JSON.stringify(existingScores));
        
        this.showMessage(PT_STRINGS.SCORE_SAVED_SUCCESS, 'success');
    }

    loadScores() {
        const savedScores = JSON.parse(localStorage.getItem('interviewScores') || '[]');
        const scoresContainer = document.getElementById('savedScores');
        const scoresList = document.getElementById('scoresList');

        if (savedScores.length === 0) {
            scoresList.innerHTML = `<p>${PT_STRINGS.NO_SAVED_SCORES}</p>`;
        } else {
            scoresList.innerHTML = savedScores
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map(score => this.createScoreItem(score))
                .join('');
        }

        scoresContainer.style.display = scoresContainer.style.display === 'none' ? 'block' : 'none';
    }

    createScoreItem(score) {
        const percentage = Math.round((score.totalScore / score.maxTotalScore) * 100);
        const date = new Date(score.timestamp).toLocaleDateString('pt-BR');
        const time = new Date(score.timestamp).toLocaleTimeString('pt-BR');

        return `
            <div class="saved-score-item">
                <h4>${score.candidateName}</h4>
                <div class="saved-score-meta">
                    <span><strong>${PT_STRINGS.POSITION_LABEL}</strong> ${score.position || 'N/A'}</span>
                    <span><strong>${PT_STRINGS.DATE_LABEL}</strong> ${score.interviewDate || 'N/A'}</span>
                    <span><strong>${PT_STRINGS.INTERVIEWER_LABEL}</strong> ${score.interviewer || 'N/A'}</span>
                    <span><strong>${PT_STRINGS.SAVED_LABEL}</strong> ${date} às ${time}</span>
                </div>
                <div class="saved-score-total">
                    Pontuação: ${score.totalScore}/${score.maxTotalScore} (${percentage}%)
                </div>
                ${score.notes ? `<p><strong>${PT_STRINGS.NOTES_LABEL}</strong> ${score.notes}</p>` : ''}
                <div style="margin-top: 10px;">
                    <button onclick="interviewScoreCard.loadScoreData('${score.id}')" class="btn btn-secondary" style="margin-right: 10px; padding: 8px 16px; font-size: 0.9rem;">${PT_STRINGS.LOAD_BUTTON}</button>
                    <button onclick="interviewScoreCard.deleteScore('${score.id}')" class="btn btn-danger" style="padding: 8px 16px; font-size: 0.9rem;">${PT_STRINGS.DELETE_BUTTON}</button>
                </div>
            </div>
        `;
    }

    loadScoreData(scoreId) {
        const savedScores = JSON.parse(localStorage.getItem('interviewScores') || '[]');
        const score = savedScores.find(s => s.id === scoreId);
        
        if (!score) {
            this.showMessage(PT_STRINGS.SCORE_NOT_FOUND, 'error');
            return;
        }

        // Load form data
        document.getElementById('candidateName').value = score.candidateName;
        document.getElementById('interviewDate').value = score.interviewDate;
        document.getElementById('position').value = score.position;
        document.getElementById('interviewer').value = score.interviewer;
        document.getElementById('notes').value = score.notes;

        // Clear all checkboxes first
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);

        // This is a simplified approach - in a real app, you'd need to store which specific items were checked
        this.showMessage(PT_STRINGS.FORM_DATA_LOADED, 'success');
    }

    deleteScore(scoreId) {
        if (confirm(PT_STRINGS.DELETE_CONFIRM)) {
            const savedScores = JSON.parse(localStorage.getItem('interviewScores') || '[]');
            const updatedScores = savedScores.filter(s => s.id !== scoreId);
            localStorage.setItem('interviewScores', JSON.stringify(updatedScores));
            this.loadScores(); // Refresh the display
            this.showMessage(PT_STRINGS.SCORE_DELETED_SUCCESS, 'success');
        }
    }

    clearForm() {
        if (confirm(PT_STRINGS.CLEAR_FORM_CONFIRM)) {
            // Clear form inputs
            document.getElementById('candidateName').value = '';
            document.getElementById('interviewDate').value = '';
            document.getElementById('position').value = '';
            document.getElementById('interviewer').value = '';
            document.getElementById('notes').value = '';

            // Clear checkboxes
            document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);

            // Reset scores
            Object.keys(this.scores).forEach(category => {
                this.scores[category] = 0;
            });

            this.updateScoreDisplay();
            this.setCurrentDate();
            localStorage.removeItem('interviewFormData');
            this.showMessage(PT_STRINGS.FORM_CLEARED_SUCCESS, 'success');
        }
    }

    exportScore() {
        const candidateName = document.getElementById('candidateName').value.trim();
        if (!candidateName) {
            this.showMessage(PT_STRINGS.ENTER_NAME_EXPORT, 'error');
            return;
        }

        const exportData = {
            candidateName: candidateName,
            interviewDate: document.getElementById('interviewDate').value,
            position: document.getElementById('position').value,
            interviewer: document.getElementById('interviewer').value,
            scores: { ...this.scores },
            maxScores: { ...this.maxScores },
            totalScore: Object.values(this.scores).reduce((sum, score) => sum + score, 0),
            maxTotalScore: Object.values(this.maxScores).reduce((sum, score) => sum + score, 0),
            percentage: Math.round((Object.values(this.scores).reduce((sum, score) => sum + score, 0) / Object.values(this.maxScores).reduce((sum, score) => sum + score, 0)) * 100),
            notes: document.getElementById('notes').value,
            exportDate: new Date().toISOString()
        };

        // Create and download JSON file
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `pontuacao-entrevista-${candidateName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.showMessage(PT_STRINGS.SCORE_EXPORTED_SUCCESS, 'success');
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.success-message, .error-message');
        existingMessages.forEach(msg => msg.remove());

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
        messageDiv.textContent = message;

        // Insert at the top of the container
        const container = document.querySelector('.container');
        container.insertBefore(messageDiv, container.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.interviewScoreCard = new InterviewScoreCard();
});

// Adicionar algumas funções utilitárias para melhor UX
document.addEventListener('DOMContentLoaded', () => {
    // Adicionar atalhos de teclado
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + S para salvar
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            document.getElementById('saveScore').click();
        }
        
        // Ctrl/Cmd + E para exportar
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            document.getElementById('exportScore').click();
        }
    });

    // Adicionar tooltips para melhor UX
    const addTooltip = (element, text) => {
        element.title = text;
    };

    // Adicionar tooltips aos botões
    addTooltip(document.getElementById('saveScore'), PT_STRINGS.SAVE_TOOLTIP);
    addTooltip(document.getElementById('loadScores'), PT_STRINGS.LOAD_TOOLTIP);
    addTooltip(document.getElementById('clearForm'), PT_STRINGS.CLEAR_TOOLTIP);
    addTooltip(document.getElementById('exportScore'), PT_STRINGS.EXPORT_TOOLTIP);
});
