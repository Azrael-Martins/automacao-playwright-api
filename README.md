
# Projeto de Automação Irisys

## Objetivo
Automatizar os fluxos críticos da aplicação visando:
- Redução do tempo de execução dos testes
- Aumento da qualidade do produto
- Maior confiabilidade nas validações
- Apoio contínuo ao processo de regressão
## Responsáveis
- Tech Lead: Rafael Dias
- QA Automation: Azrael Martins
# Stack Utilizada
- Playwright
- Node.js
- JavaScript
# Instalação e Configuração
## Pré-requisitos
-  Node.js
### Software
- Node.js versão 18 ou superior
- Git instalado na máquina
### Hardware recomendado
- Mínimo: 4GB RAM
- Recomendado: 8GB RAM

# Estrutura recomendada
Na raiz do disco C:, crie uma nova pasta com nome do seu projeto
Exemplo:C:\AutomationWeb

# Estrutura do Projeto
# usar tags para smoke/regression/e2e/critical

```txt
AUTOMATIONWEB/
│
├── .github/
│   └── workflows/
│       └── playwright.yml       # Pipeline de execução CI/CD
│
├── node_modules/                # Dependências do projeto
│
├── pages/                       # Page Objects
│   ├── administrativo/
│   ├── monitoramento/
│   ├── financeiro/
│   ├── controle/
│   ├── documentos/
│   ├── fiscal/
│   └── homepage/
│
├── playwright-report/           # Relatórios HTML gerados pelo Playwright
│   ├── data/
│   ├── trace/
│   └── index.html
│
├── test-results/                # Evidências e resultados das execuções
│
├── tests/                       # Cenários de teste
│   │
│   ├── administrativo/          # Testes do módulo administrativo
│   │
│   ├── monitoramento/           # Testes do módulo monitoramento
│   │
│   ├── financeiro/              # Testes do módulo financeiro
│   │     
│   ├── controle/                # Testes do módulo controle
│   │
│   ├── documentos/              # Testes do módulo documentos
│   │
│   ├── fiscal/                  # Testes do módulo fiscal
│   │
│   ├── home/
       
│
├── .env                         # Variáveis de ambiente
├── .gitignore                   # Arquivos ignorados pelo Git
├── package-lock.json            # Controle de versões das dependências
├── package.json                 # Configuração do projeto Node.js
├── playwright.config.js         # Configuração principal do Playwright
└── README.md                    # Documentação do projeto
```
        


