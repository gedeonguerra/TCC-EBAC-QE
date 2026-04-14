# Mobile – Testes no App EBAC Shop

## Funcionalidade coberta
**Catálogo de Produtos** (conforme especificado no TCC)

## Plataforma escolhida: Android
Framework: **Appium + WebDriverIO**
Pattern: **Page Object Model (POM)**

## Setup

1. Instalar dependências:
```bash
npm install
```

2. Instalar Appium:
```bash
npm install -g appium
appium driver install uiautomator2
```

3. Baixar o APK:
- Android: https://github.com/EBAC-QE/testes-mobile-ebac-shop/tree/main/app/android

4. Iniciar emulador Android e executar:
```bash
npx wdio run wdio.conf.js
```

## Cenários de Teste – Catálogo de Produtos

| ID | Cenário | Tipo |
|----|---------|------|
| CT-MOB-001 | Listar produtos na tela inicial | Caminho Feliz |
| CT-MOB-002 | Buscar produto por nome | Caminho Feliz |
| CT-MOB-003 | Filtrar produtos por categoria | Caminho Feliz |
| CT-MOB-004 | Busca com termo inexistente exibe mensagem | Caminho Negativo |
| CT-MOB-005 | Toque em produto abre tela de detalhes | Caminho Feliz |

## Estrutura de pastas
```
Mobile/
├── tests/
│   └── catalog.test.js
├── pages/
│   └── CatalogPage.js
└── wdio.conf.js
```
