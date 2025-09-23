/**
 * Main Application Entry Point
 * Initializes the Interview Score Card application using modular architecture
 */

// Import all required modules
import { InterviewScoreCardApp } from './js/app.js';

// Global application instance
let app = null;

/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Create and initialize the application
        app = new InterviewScoreCardApp();
        
        // Make app globally accessible for backward compatibility
        window.interviewScoreCard = app;
        
        console.log('Interview Score Card application initialized successfully');
    } catch (error) {
        console.error('Failed to initialize application:', error);
        
        // Show user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #f8d7da;
            color: #721c24;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #f5c6cb;
            z-index: 10000;
            max-width: 400px;
            text-align: center;
        `;
        errorDiv.innerHTML = `
            <h3>Erro ao Carregar Aplicação</h3>
            <p>Ocorreu um erro ao inicializar a aplicação. Por favor, recarregue a página.</p>
            <button onclick="location.reload()" style="
                background: #dc3545;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 10px;
            ">Recarregar Página</button>
        `;
        document.body.appendChild(errorDiv);
    }
});

/**
 * Cleanup when page is unloaded
 */
window.addEventListener('beforeunload', () => {
    if (app && typeof app.destroy === 'function') {
        app.destroy();
    }
});

/**
 * Handle unhandled promise rejections
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Show user-friendly error message
    if (app && app.uiManager) {
        app.uiManager.showMessage('Ocorreu um erro inesperado. Tente novamente.', 'error');
    }
});

/**
 * Handle global errors
 */
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    
    // Show user-friendly error message
    if (app && app.uiManager) {
        app.uiManager.showMessage('Ocorreu um erro inesperado. Tente recarregar a página.', 'error');
    }
});
