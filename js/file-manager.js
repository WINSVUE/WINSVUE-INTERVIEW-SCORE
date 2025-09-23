/**
 * File management service
 * Handles file import/export operations
 */
import { CONFIG } from './config.js';

export class FileManager {
    /**
     * Export score data to JSON file
     * @param {Object} scoreData - Score data to export
     * @param {string} candidateName - Candidate name for filename
     * @returns {Promise<boolean>} Success status
     */
    static async exportScore(scoreData, candidateName) {
        try {
            // Validate data before export
            if (!scoreData || !candidateName) {
                throw new Error('Dados inválidos para exportação');
            }
            
            // Create export data with metadata
            const exportData = {
                ...scoreData,
                exportDate: new Date().toISOString(),
                version: CONFIG.VERSION,
                appName: CONFIG.APP_NAME
            };
            
            // Convert to JSON
            const jsonData = JSON.stringify(exportData, null, 2);
            
            // Create blob
            const blob = new Blob([jsonData], { type: CONFIG.FILE.MIME_TYPE });
            
            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            
            // Generate filename
            const sanitizedName = candidateName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
            const date = new Date().toISOString().split('T')[0];
            link.download = `${CONFIG.FILE.EXPORT_PREFIX}-${sanitizedName}-${date}.json`;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up
            URL.revokeObjectURL(url);
            
            return true;
        } catch (error) {
            console.error('Error exporting score:', error);
            throw new Error('Erro ao exportar pontuação: ' + error.message);
        }
    }
    
    /**
     * Import score data from file
     * @param {File} file - File to import
     * @returns {Promise<Object>} Imported data
     */
    static async importScore(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error('Nenhum arquivo selecionado'));
                return;
            }
            
            // Validate file type
            if (!this.isValidFileType(file)) {
                reject(new Error('Tipo de arquivo inválido. Use um arquivo JSON.'));
                return;
            }
            
            // Validate file size (max 1MB)
            if (file.size > 1024 * 1024) {
                reject(new Error('Arquivo muito grande. Máximo 1MB permitido.'));
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    resolve(data);
                } catch (error) {
                    reject(new Error('Erro ao processar arquivo JSON: ' + error.message));
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Erro ao ler arquivo'));
            };
            
            reader.readAsText(file);
        });
    }
    
    /**
     * Validate file type
     * @param {File} file - File to validate
     * @returns {boolean} Whether file type is valid
     */
    static isValidFileType(file) {
        const validTypes = ['application/json', 'text/json'];
        const validExtensions = CONFIG.FILE.ACCEPTED_EXTENSIONS;
        
        // Check MIME type
        if (validTypes.includes(file.type)) {
            return true;
        }
        
        // Check file extension
        const fileName = file.name.toLowerCase();
        return validExtensions.some(ext => fileName.endsWith(ext));
    }
    
    /**
     * Create file input element for import
     * @returns {HTMLInputElement} File input element
     */
    static createFileInput() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = CONFIG.FILE.ACCEPTED_EXTENSIONS.join(',');
        input.style.display = 'none';
        return input;
    }
    
    /**
     * Trigger file selection dialog
     * @returns {Promise<File>} Selected file
     */
    static async selectFile() {
        return new Promise((resolve, reject) => {
            const input = this.createFileInput();
            
            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    resolve(file);
                } else {
                    reject(new Error('Nenhum arquivo selecionado'));
                }
            });
            
            input.addEventListener('cancel', () => {
                reject(new Error('Seleção de arquivo cancelada'));
            });
            
            // Add to DOM temporarily
            document.body.appendChild(input);
            input.click();
            
            // Clean up after a delay
            setTimeout(() => {
                if (input.parentNode) {
                    input.parentNode.removeChild(input);
                }
            }, 1000);
        });
    }
    
    /**
     * Validate imported data structure
     * @param {Object} data - Imported data
     * @returns {Object} Validation result
     */
    static validateImportedData(data) {
        const requiredFields = ['candidateName', 'scores', 'maxScores', 'totalScore'];
        const missingFields = requiredFields.filter(field => !(field in data));
        
        if (missingFields.length > 0) {
            return {
                isValid: false,
                message: `Campos obrigatórios ausentes: ${missingFields.join(', ')}`
            };
        }
        
        // Check if it's from this application
        if (data.appName && data.appName !== CONFIG.APP_NAME) {
            return {
                isValid: false,
                message: 'Arquivo não é compatível com esta versão da aplicação'
            };
        }
        
        return {
            isValid: true,
            message: 'Dados válidos'
        };
    }
    
    /**
     * Get file info
     * @param {File} file - File to get info for
     * @returns {Object} File information
     */
    static getFileInfo(file) {
        return {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: new Date(file.lastModified),
            sizeFormatted: this.formatFileSize(file.size)
        };
    }
    
    /**
     * Format file size in human readable format
     * @param {number} bytes - File size in bytes
     * @returns {string} Formatted file size
     */
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}
