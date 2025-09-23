// Portuguese Language Constants for Interview Score Card
const PT_STRINGS = {
    // Page titles and headers
    PAGE_TITLE: 'Cartão de Avaliação de Entrevista de Desenvolvedor',
    PAGE_SUBTITLE: 'Ferramenta abrangente de avaliação para entrevistas de código',
    
    // Candidate information
    CANDIDATE_INFO: 'Informações do Candidato',
    CANDIDATE_NAME: 'Nome do Candidato:',
    CANDIDATE_NAME_PLACEHOLDER: 'Digite o nome do candidato',
    INTERVIEW_DATE: 'Data da Entrevista:',
    POSITION: 'Cargo:',
    POSITION_PLACEHOLDER: 'ex: Desenvolvedor Frontend Sênior',
    INTERVIEWER: 'Entrevistador:',
    INTERVIEWER_PLACEHOLDER: 'Seu nome',
    
    // Technical assessment
    TECHNICAL_ASSESSMENT: 'Avaliação Técnica',
    
    // Categories
    CODE_QUALITY: 'Qualidade do Código e Boas Práticas',
    ARCHITECTURE: 'Arquitetura e Design',
    PROBLEM_SOLVING: 'Resolução de Problemas e Lógica',
    TECHNICAL_KNOWLEDGE: 'Conhecimento Técnico',
    COMMUNICATION: 'Comunicação e Colaboração',
    
    // Code Quality criteria
    CLEAN_CODE_STRUCTURE: 'Estrutura de código limpa e legível',
    NAMING_CONVENTIONS: 'Convenções de nomenclatura adequadas',
    CONSISTENT_FORMATTING: 'Formatação de código consistente',
    DRY_PRINCIPLE: 'Implementação do princípio DRY',
    MEANINGFUL_COMMENTS: 'Comentários e documentação significativos',
    ERROR_HANDLING: 'Implementação de tratamento de erros',
    
    // Architecture criteria
    COMPONENTIZATION: 'Componentização/modularização adequada',
    SEPARATION_CONCERNS: 'Separação de responsabilidades',
    SCALABLE_ARCHITECTURE: 'Design de arquitetura escalável',
    DESIGN_PATTERNS: 'Uso de padrões de design',
    DATA_FLOW: 'Gerenciamento de fluxo de dados',
    STATE_MANAGEMENT: 'Abordagem de gerenciamento de estado',
    
    // Problem Solving criteria
    EFFICIENT_ALGORITHMS: 'Implementação eficiente de algoritmos',
    TIME_COMPLEXITY: 'Consideração de complexidade temporal',
    SPACE_COMPLEXITY: 'Otimização de complexidade espacial',
    EDGE_CASE_HANDLING: 'Tratamento de casos extremos',
    LOGICAL_THINKING: 'Processo de pensamento lógico',
    DEBUGGING_SKILLS: 'Demonstração de habilidades de depuração',
    
    // Technical Knowledge criteria
    LANGUAGE_BEST_PRACTICES: 'Boas práticas específicas da linguagem',
    FRAMEWORK_KNOWLEDGE: 'Conhecimento de frameworks/bibliotecas',
    VERSION_CONTROL: 'Proficiência em controle de versão',
    TESTING_APPROACH: 'Compreensão de abordagem de testes',
    SECURITY_CONSIDERATIONS: 'Considerações de segurança',
    PERFORMANCE_OPTIMIZATION: 'Consciência de otimização de performance',
    
    // Communication criteria
    CLEAR_EXPLANATION: 'Explicação clara da abordagem',
    CLARIFICATION_QUESTIONS: 'Perguntas feitas para esclarecimento',
    CODE_WALKTHROUGH: 'Capacidade de apresentar o código',
    RECEPTIVE_FEEDBACK: 'Receptivo ao feedback',
    COLLABORATIVE_SOLVING: 'Resolução colaborativa de problemas',
    
    // Additional notes
    ADDITIONAL_NOTES: 'Notas Adicionais',
    NOTES_PLACEHOLDER: 'Adicione observações adicionais, pontos fortes ou áreas de melhoria...',
    
    // Score display
    SCORE_SUMMARY: 'Resumo da Pontuação',
    CODE_QUALITY_SCORE: 'Qualidade do Código:',
    ARCHITECTURE_SCORE: 'Arquitetura:',
    PROBLEM_SOLVING_SCORE: 'Resolução de Problemas:',
    TECHNICAL_SCORE: 'Conhecimento Técnico:',
    COMMUNICATION_SCORE: 'Comunicação:',
    TOTAL_SCORE: 'Pontuação Total:',
    
    // Actions
    SAVE_SCORE: 'Salvar Pontuação',
    LOAD_SCORES: 'Carregar Pontuações Anteriores',
    CLEAR_FORM: 'Limpar Formulário',
    EXPORT_SCORE: 'Exportar Pontuação',
    
    // Saved scores
    PREVIOUS_SCORES: 'Pontuações Anteriores',
    NO_SAVED_SCORES: 'Nenhuma pontuação salva encontrada.',
    POSITION_LABEL: 'Cargo:',
    DATE_LABEL: 'Data:',
    INTERVIEWER_LABEL: 'Entrevistador:',
    SAVED_LABEL: 'Salvo:',
    NOTES_LABEL: 'Notas:',
    LOAD_BUTTON: 'Carregar',
    DELETE_BUTTON: 'Excluir',
    
    // Messages
    ENTER_CANDIDATE_NAME: 'Por favor, digite o nome do candidato antes de salvar.',
    SCORE_SAVED_SUCCESS: 'Pontuação salva com sucesso!',
    SCORE_NOT_FOUND: 'Pontuação não encontrada.',
    FORM_DATA_LOADED: 'Dados do formulário carregados. Por favor, re-selecione os critérios que foram atendidos.',
    SCORE_DELETED_SUCCESS: 'Pontuação excluída com sucesso.',
    CLEAR_FORM_CONFIRM: 'Tem certeza de que deseja limpar todos os dados do formulário?',
    FORM_CLEARED_SUCCESS: 'Formulário limpo com sucesso.',
    ENTER_NAME_EXPORT: 'Por favor, digite o nome do candidato antes de exportar.',
    SCORE_EXPORTED_SUCCESS: 'Pontuação exportada com sucesso!',
    DELETE_CONFIRM: 'Tem certeza de que deseja excluir esta pontuação?',
    
    // Tooltips
    SAVE_TOOLTIP: 'Salvar a pontuação atual no armazenamento local (Ctrl+S)',
    LOAD_TOOLTIP: 'Visualizar e carregar pontuações salvas anteriormente',
    CLEAR_TOOLTIP: 'Limpar todos os dados do formulário e começar do zero',
    EXPORT_TOOLTIP: 'Exportar pontuação atual como arquivo JSON (Ctrl+E)',
    
    // Company signature
    COMPANY_SIGNATURE: 'WINSVUE DEVELOPMENT',
    COMPANY_TAGLINE: 'Desenvolvimento de Software de Excelência',
    COMPANY_COPYRIGHT: '© 2024 WINSVUE DEVELOPMENT. Todos os direitos reservados.',
    
    // Score categories for calculations
    SCORE_CATEGORIES: {
        'code-quality': 'Qualidade do Código',
        'architecture': 'Arquitetura',
        'problem-solving': 'Resolução de Problemas',
        'technical': 'Conhecimento Técnico',
        'communication': 'Comunicação'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PT_STRINGS;
}
