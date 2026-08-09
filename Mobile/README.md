# Mobile – Testes no App EBAC Shop

Testes E2E mobile cobrindo Android e iOS.
Framework: **Appium + WebDriverIO** · Pattern: **Page Object Model (POM)**

## Android — Catálogo de Produtos
Conforme especificado no TCC. Detalhes em [`Android/`](./Android).

| ID | Cenário | Tipo |
|----|---------|------|
| CT-MOB-001 | Listar produtos na tela inicial | Caminho Feliz |
| CT-MOB-002 | Buscar produto por nome | Caminho Feliz |
| CT-MOB-003 | Filtrar produtos por categoria | Caminho Feliz |
| CT-MOB-004 | Busca com termo inexistente exibe mensagem | Caminho Negativo |
| CT-MOB-005 | Toque em produto abre tela de detalhes | Caminho Feliz |

\`\`\`bash
cd Android
npm install
npm install -g appium && appium driver install uiautomator2
npx wdio run wdio.conf.js
\`\`\`

## iOS — Checkout completo

> Projeto de estudo/exercício de curso — mantido como registro de aprendizado.

Fluxo de compra completo (login → carrinho → pagamento → confirmação), executado via Appium + SauceLabs (iOS Simulator). Detalhes em [`iOS/`](./iOS).

1. Login → 2. Browse → 3. Selecionar produto → 4. Adicionar ao carrinho → 5. Endereço → 6. Pagamento (Cash on Delivery) → 7. Checkout → 8. Validar "Order Success"

\`\`\`bash
cd iOS
npm install
# criar .env a partir de env.example com credenciais SauceLabs
npm run test:sauce:ios
\`\`\`

## Estrutura de pastas
\`\`\`
Mobile/
├── Android/
│   ├── tests/catalog.test.js
│   ├── pages/CatalogPage.js
│   └── wdio.conf.js
└── iOS/
    ├── test/pageobjects/
    ├── test/specs/checkout.spec.js
    ├── wdio.conf.js
    └── env.example
\`\`\`