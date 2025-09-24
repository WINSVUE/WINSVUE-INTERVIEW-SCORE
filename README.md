# Cartão de Avaliação de Entrevista de Desenvolvedor

<p align="center">
	<img src="https://img.shields.io/github/last-commit/York-Lucis/WINSVUE-INTERVIEW-SCORE?style=default&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/York-Lucis/WINSVUE-INTERVIEW-SCORE?style=default&color=0080ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/York-Lucis/WINSVUE-INTERVIEW-SCORE?style=default&color=0080ff" alt="repo-language-count">
</p>

## 📋 Visão Geral

O **Cartão de Avaliação de Entrevista de Desenvolvedor** é uma ferramenta web abrangente desenvolvida para facilitar e padronizar o processo de avaliação de candidatos em entrevistas técnicas de desenvolvimento de software. A aplicação permite que entrevistadores avaliem candidatos de forma estruturada e objetiva, fornecendo uma pontuação detalhada em diferentes categorias técnicas.

### 🎯 Objetivo

Esta ferramenta foi criada para:

- **Padronizar** o processo de avaliação de entrevistas técnicas
- **Documentar** de forma clara e objetiva o desempenho dos candidatos
- **Facilitar** a comparação entre diferentes candidatos
- **Armazenar** histórico de avaliações para referência futura
- **Exportar/Importar** dados para compartilhamento e backup

## ✨ Funcionalidades

### 📊 Sistema de Avaliação

- **5 Categorias Principais** de avaliação:

  - Qualidade do Código e Boas Práticas
  - Arquitetura e Design
  - Resolução de Problemas e Lógica
  - Conhecimento Técnico
  - Comunicação e Colaboração

- **Sistema de Pontuação Ponderada** com pesos diferentes para cada critério
- **Cálculo Automático** de pontuação total e percentual
- **Indicadores Visuais** de desempenho com cores baseadas na pontuação

### 💾 Gerenciamento de Dados

- **Salvamento Automático** de dados do formulário
- **Armazenamento Local** de múltiplas avaliações
- **Exportação** para arquivos JSON
- **Importação** de avaliações salvas
- **Histórico Completo** de avaliações anteriores

### 🎨 Interface do Usuário

- **Design Responsivo** para desktop e mobile
- **Interface Intuitiva** e fácil de usar
- **Animações Suaves** para melhor experiência
- **Mensagens de Feedback** para todas as operações
- **Atalhos de Teclado** para operações rápidas

### 🆕 Novas Features

- **Importação Aprimorada**: Ao importar uma avaliação, a aplicação agora exibe informações detalhadas sobre:
  - Avaliação Técnica
  - Notas Adicionais
- **Validação de Importação**: Verificação automática da integridade dos dados importados

## 🚀 Instalação e Configuração

### Pré-requisitos

- **Python 3.x** instalado no sistema
- **Navegador Web** moderno (Chrome, Firefox, Safari, Edge)
- **Sistema Operacional**: Windows, macOS ou Linux

### Instalação Rápida

#### Opção 1: Usando o Arquivo Batch (Windows)

1. **Baixe** todos os arquivos do projeto
2. **Execute** o arquivo `start-server.bat`
3. **Aguarde** a inicialização do servidor
4. **Abra** seu navegador e acesse `http://localhost:8000`

#### Opção 2: Comando Manual

1. **Abra** o terminal/prompt de comando
2. **Navegue** até a pasta do projeto:
   ```bash
   cd caminho/para/o/projeto
   ```
3. **Execute** o servidor web:
   ```bash
   python -m http.server 8000
   ```
4. **Acesse** `http://localhost:8000` no navegador

### Verificação da Instalação

- ✅ Servidor iniciado sem erros
- ✅ Página carrega corretamente
- ✅ Todos os botões funcionam
- ✅ Formulário responde às interações

## 📖 Como Usar

### 1. Preenchimento de Dados do Candidato

- **Nome do Candidato**: Campo obrigatório
- **Data da Entrevista**: Preenchida automaticamente com a data atual
- **Cargo**: Posição para a qual o candidato está se candidatando
- **Entrevistador**: Nome do entrevistador responsável

### 2. Avaliação Técnica

- **Marque** os critérios que o candidato atendeu
- **Observe** a pontuação sendo calculada automaticamente
- **Revise** cada categoria antes de finalizar

### 3. Notas Adicionais

- **Adicione** observações importantes
- **Documente** pontos fortes e áreas de melhoria
- **Registre** impressões gerais sobre o candidato

### 4. Salvamento e Exportação

- **Salve** a avaliação no armazenamento local
- **Exporte** para arquivo JSON para backup
- **Carregue** avaliações anteriores quando necessário

## 🎹 Atalhos de Teclado

| Atalho     | Ação                           |
| ---------- | ------------------------------ |
| `Ctrl + S` | Salvar pontuação               |
| `Ctrl + E` | Exportar pontuação             |
| `Ctrl + L` | Carregar pontuações anteriores |

## 🏗️ Arquitetura Técnica

### Estrutura do Projeto

```
wins-interview-score/
├── index.html              # Página principal
├── styles.css              # Estilos da aplicação
├── script.js               # Ponto de entrada da aplicação
├── constants.js            # Constantes e strings de localização
├── start-server.bat        # Script para iniciar servidor (Windows)
├── README.md               # Documentação do projeto
└── js/                     # Módulos JavaScript
    ├── config.js           # Configurações da aplicação
    ├── validation.js       # Validação de dados
    ├── storage.js          # Gerenciamento de armazenamento
    ├── ui-manager.js       # Gerenciamento da interface
    ├── score-manager.js    # Cálculo de pontuações
    ├── file-manager.js     # Importação/exportação de arquivos
    └── app.js              # Classe principal da aplicação
```

### Tecnologias Utilizadas

- **HTML5**: Estrutura semântica da página
- **CSS3**: Estilos modernos e responsivos
- **JavaScript ES6+**: Lógica da aplicação com módulos
- **LocalStorage**: Armazenamento de dados local
- **File API**: Importação e exportação de arquivos

### Princípios de Código Limpo

- ✅ **Separação de Responsabilidades**: Cada módulo tem uma função específica
- ✅ **Princípio DRY**: Evita duplicação de código
- ✅ **Nomes Descritivos**: Variáveis e funções com nomes claros
- ✅ **Funções Pequenas**: Cada função tem uma responsabilidade única
- ✅ **Tratamento de Erros**: Validação e tratamento robusto de erros
- ✅ **Documentação**: Comentários JSDoc e documentação abrangente

## 🔧 Desenvolvimento

### Estrutura Modular

A aplicação foi desenvolvida seguindo princípios de **código limpo** e **arquitetura modular**:

- **config.js**: Configurações centralizadas
- **validation.js**: Validação de entrada de dados
- **storage.js**: Gerenciamento de armazenamento local
- **ui-manager.js**: Manipulação da interface do usuário
- **score-manager.js**: Cálculo e gerenciamento de pontuações
- **file-manager.js**: Operações de arquivo (import/export)
- **app.js**: Orquestração principal da aplicação

### Adicionando Novos Critérios

Para adicionar novos critérios de avaliação:

1. **Edite** o arquivo `index.html` para adicionar o novo checkbox
2. **Atualize** as configurações em `js/config.js`
3. **Adicione** as strings de localização em `constants.js`

### Personalização

- **Cores**: Modifique as variáveis CSS em `styles.css`
- **Textos**: Atualize as strings em `constants.js`
- **Critérios**: Adicione/remova critérios em `index.html` e `config.js`

## 🐛 Solução de Problemas

### Problemas Comuns

#### ❌ "Erro ao Carregar Aplicação"

- **Causa**: Servidor não está rodando ou módulos não carregam
- **Solução**: Verifique se o servidor está ativo em `http://localhost:8000`

#### ❌ Botões não funcionam

- **Causa**: JavaScript não carregou ou há erros de console
- **Solução**: Abra o console do navegador (F12) e verifique erros

#### ❌ Dados não salvam

- **Causa**: LocalStorage não disponível ou bloqueado
- **Solução**: Verifique se o navegador permite armazenamento local

#### ❌ Importação não funciona

- **Causa**: Arquivo JSON inválido ou corrompido
- **Solução**: Use apenas arquivos exportados pela própria aplicação

### Logs de Debug

A aplicação inclui logs detalhados no console do navegador para facilitar a depuração:

- **Exportação**: Mostra dados sendo exportados
- **Importação**: Mostra processo de restauração
- **Checkboxes**: Detalha o processo de correspondência

## 📄 Licença

Este projeto foi desenvolvido pela **WINS GAMES** e está disponível para uso interno e educacional.

## 🤝 Contribuição

Para contribuir com o projeto:

1. **Fork** o repositório
2. **Crie** uma branch para sua feature
3. **Commit** suas mudanças
4. **Push** para a branch
5. **Abra** um Pull Request

<summary>Gráfico de Contribuidores</summary>
<br>
<p align="left">
   <a href="https://github.com/York-Lucis/WINSVUE-INTERVIEW-SCORE/graphs/contributors">
      <img src="https://contrib.rocks/image?repo=York-Lucis/WINSVUE-INTERVIEW-SCORE">
   </a>
</p>
</details>

## 📞 Suporte

Para suporte técnico ou dúvidas:

- **Email**: dev@winsvue.gg
- **Documentação**: Consulte este README
- **Issues**: Abra uma issue no repositório

---

**WINS GAMES** - © 2025 WINS GAMES. Todos os direitos reservados.
