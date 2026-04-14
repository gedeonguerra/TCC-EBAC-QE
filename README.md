# TCC-EBAC-QE 🎓

> **Trabalho de Conclusão de Curso** — Profissão: Engenheiro de Qualidade de Software  
> **Projeto:** EBAC Shop — `http://lojaebac.ebaconline.art.br/`

[![UI Tests](https://github.com/gedeonguerra/TCC-EBAC-QE/actions/workflows/ci.yml/badge.svg)](https://github.com/gedeonguerra/TCC-EBAC-QE/actions)

---

## 📋 Histórias de Usuário Cobertas

| US | Funcionalidade | Prioridade |
|----|---------------|-----------|
| US-0001 | Adicionar item ao carrinho | Média |
| US-0002 | Login na plataforma | Média |
| US-0003 | API de Cupons | Média |

---

## 🗂️ Estrutura do Projeto

```
TCC-EBAC-QE/
├── UI/                         # Testes de interface Web
│   ├── pages/
│   │   ├── LoginPage.js        # POM – Página de Login
│   │   └── CartPage.js         # POM – Carrinho de Compras
│   ├── tests/
│   │   ├── login.spec.js       # 6 testes – US-0002
│   │   └── cart.spec.js        # 8 testes – US-0001
│   ├── playwright.config.js
│   └── package.json
│
├── API/                        # Testes de API REST
│   ├── tests/
│   │   └── coupons.test.js     # 9 testes – US-0003 (+ contrato)
│   └── package.json
│
├── Mobile/                     # Testes Mobile Android
│   ├── pages/
│   │   └── CatalogPage.js      # POM – Catálogo de Produtos
│   ├── tests/
│   │   └── catalog.test.js     # 5 testes – Catálogo Mobile
│   ├── wdio.conf.js
│   └── package.json
│
├── Performance/                # Testes de carga K6
│   ├── login.k6.js             # 20 VUs | 2 min | Login
│   └── coupons.k6.js           # 20 VUs | 2 min | API Cupons
│
└── .github/workflows/
    └── ci.yml                  # Pipeline GitHub Actions
```

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 20+
- K6 instalado (`brew install k6` ou via apt)
- Appium (para Mobile)

### Testes de UI (Playwright)
```bash
cd UI
npm install
npx playwright install chromium
npm test
```

### Testes de API (Supertest + Jest)
```bash
cd API
npm install
npm test
```

### Testes Mobile (Appium + WebDriverIO)
```bash
cd Mobile
npm install
# Subir emulador Android antes
npm test
```

### Testes de Performance (K6)
```bash
# Login
k6 run Performance/login.k6.js

# API Cupons
k6 run Performance/coupons.k6.js
```

---

## 🛠️ Stack de Ferramentas

| Camada | Ferramenta | Justificativa |
|--------|-----------|---------------|
| UI | Playwright | Execução paralela, multi-browser, relatório HTML nativo |
| API | Supertest + Jest | Integração nativa Node.js, validação de contratos |
| Mobile | Appium + WDIO | Padrão da indústria para Android/iOS |
| Performance | K6 | Scripting em JS, thresholds configuráveis, CI-friendly |
| CI/CD | GitHub Actions | Nativo ao repositório, gratuito para projetos públicos |

---

## 📊 Cobertura de Testes

| Tipo | Casos | Status |
|------|-------|--------|
| UI (Playwright) | 14 | ✅ Automatizado |
| API (Supertest) | 9 | ✅ Automatizado |
| Mobile (Appium) | 5 | ✅ Automatizado |
| Performance (K6) | 2 | ✅ Automatizado |
| **Total** | **30** | |

---

## ⚙️ CI/CD — GitHub Actions

O pipeline executa automaticamente em pushes para `main` e `develop`:

1. **Job `api-tests`** → Jest + Supertest → artefato `api-report.json`
2. **Job `ui-tests`** → Playwright → artefato `playwright-report/`
3. **Job `performance-tests`** → K6 → artefatos `*-summary.json`
