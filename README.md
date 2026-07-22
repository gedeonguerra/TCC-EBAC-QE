# EBAC Shop — Test Automation Suite

Suíte de testes automatizados para o e-commerce **EBAC Shop**, cobrindo interface web, API REST, aplicativo mobile e performance, com pipeline de integração contínua rodando a cada push.

O projeto nasceu como Trabalho de Conclusão de Curso (Engenharia de Qualidade de Software) e reproduz, em escala reduzida, o que se espera de uma esteira de qualidade em ambiente real: estratégia de testes documentada, rastreabilidade entre requisitos e automações, e execução contínua via CI/CD.

[![UI Tests](https://github.com/gedeonguerra/TCC-EBAC-QE/actions/workflows/ci.yml/badge.svg)](https://github.com/gedeonguerra/TCC-EBAC-QE/actions)

---

## Sobre a aplicação sob teste

| Item | Detalhe |
|---|---|
| Aplicação | EBAC Shop (WooCommerce) |
| URL | `http://lojaebac.ebaconline.art.br` |
| Funcionalidades cobertas | Carrinho de compras, Login, API de Cupons, Catálogo (mobile) |

---

## Cobertura de testes

| Camada | Ferramenta | Cenários automatizados | Escopo |
|---|---|---|---|
| UI (Web) | Cypress | 9 | Login e Carrinho de compras |
| API | Supertest + Jest | 6 | CRUD e contrato da API de Cupons |
| Mobile (Android) | Appium + WebdriverIO | 5 | Catálogo de produtos |
| Performance | k6 | 2 scripts | Login e API de Cupons (20 VUs / 120s) |

Os cenários são especificados em Gherkin (BDD) antes da automação, e cada caso de teste é rastreável até a User Story de origem — a matriz completa está em [`CASOS-DE-TESTE.md`](./CASOS-DE-TESTE.md).

Um dos cenários de carrinho (`CT-001-03`) documenta um bug real encontrado na regra de limite de quantidade por item.

---

## Estrutura do projeto

```
├── UI/                     # Testes de interface — Cypress
│   ├── cypress/e2e/        # Specs: login e carrinho
│   ├── cypress/pages/      # Page Objects
│   └── cypress/support/    # Comandos customizados
│
├── API/                    # Testes de API — Supertest + Jest
│   └── tests/              # Cupons: CRUD + validação de contrato (Joi)
│
├── Mobile/                 # Testes mobile — Appium + WebdriverIO
│   ├── pages/               # Page Objects
│   └── tests/               # Catálogo de produtos
│
├── Performance/            # Testes de carga — k6
│   ├── login.k6.js
│   ├── coupons.k6.js
│   └── k6-performance.js
│
├── Gherkin/                # Especificação de cenários em BDD
│
├── ESTRATEGIA.md           # Estratégia de testes: técnicas, riscos, critérios
├── CASOS-DE-TESTE.md       # Casos de teste detalhados + matriz de rastreabilidade
│
└── .github/workflows/      # Pipeline de CI
```

---

## Stack técnica

| Camada | Ferramentas |
|---|---|
| UI | Cypress |
| API | Supertest, Jest, Joi (validação de schema) |
| Mobile | Appium, WebdriverIO, Allure Reporter |
| Performance | k6 |
| CI/CD | GitHub Actions |

**Técnicas de design de teste aplicadas:** Partição de Equivalência, Análise de Valor Limite, Tabela de Decisão e Validação de Contrato.

---

## Pipeline de CI/CD

O workflow (`.github/workflows/ci.yml`) roda automaticamente em push e pull request para `main` e `develop`, com três jobs paralelos:

1. **`api-tests`** — instala dependências, executa a suíte de API e publica o relatório (`api-report.json`) como artefato.
2. **`ui-tests`** — executa a suíte Cypress e publica screenshots/vídeos como artefato em caso de falha.
3. **`performance-tests`** — instala o k6 e executa os testes de carga de Login e Cupons, publicando os relatórios gerados.

---

## Como executar localmente

Pré-requisitos: Node.js 20+, k6 instalado, emulador Android configurado (para os testes mobile).

**Testes de UI (Cypress)**
```bash
cd UI
npm install
npm test              # execução headless
npm run test:open     # modo interativo
```

**Testes de API (Supertest + Jest)**
```bash
cd API
npm install
npm test
```

**Testes Mobile (Appium + WebdriverIO)**
```bash
cd Mobile
npm install
# subir o emulador Android antes de rodar
npm test
```

**Testes de Performance (k6)**
```bash
k6 run Performance/login.k6.js
k6 run Performance/coupons.k6.js
```

---

## Documentação complementar

- [`ESTRATEGIA.md`](./ESTRATEGIA.md) — objetivo, escopo, ambiente de testes, riscos e critérios de entrada/saída
- [`CASOS-DE-TESTE.md`](./CASOS-DE-TESTE.md) — casos de teste detalhados, técnica aplicada e matriz de rastreabilidade
- [`Gherkin/`](./Gherkin) — cenários em BDD por User Story
- [`TCC-EBAC-QE.docx`](./TCC-EBAC-QE.docx) — monografia completa do TCC, em formato ABNT: introdução, estratégia, casos de teste, CI/CD e conclusão
