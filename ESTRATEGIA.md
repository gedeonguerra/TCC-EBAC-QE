# Estratégia de Testes — TCC EBAC Shop
**Projeto:** EBAC-SHOP (WooCommerce)
**Versão:** 1.0
**Elaborado por:** Engenheiro de Qualidade de Software — EBAC
**Data:** 2025-05-06

---

## 1. Objetivo

Garantir a qualidade das funcionalidades entregues no escopo do TCC, cobrindo as camadas de UI, API, Mobile e Performance, com rastreabilidade entre User Stories, critérios de aceitação, casos de teste e automações.

---

## 2. Escopo

### 2.1 Funcionalidades cobertas

| US | Funcionalidade | Prioridade |
|----|---------------|-----------|
| US-0001 | Adicionar item ao carrinho | Alta |
| US-0002 | Login na plataforma | Alta |
| US-0003 | API de Cupons | Alta |

### 2.2 Fora do escopo
- Processo de pagamento (checkout completo)
- Gestão de estoque
- Cadastro de novos usuários

---

## 3. Tipos de Teste e Justificativa

| Tipo | Ferramenta | Justificativa |
|------|-----------|---------------|
| Testes de UI | Playwright | Multi-browser, relatório HTML nativo, integração fácil com CI |
| Testes de API | Supertest + Jest | Integração nativa Node.js, permite validação de contrato |
| Testes Mobile | Appium + WebDriverIO | Padrão da indústria para Android, suporte a POM |
| Testes de Performance | K6 | Scripting em JavaScript, thresholds configuráveis, CI-friendly |

---

## 4. Técnicas de Design de Testes

| Técnica | Aplicação |
|---------|-----------|
| Partição de Equivalência | Campos de login, quantidade de itens no carrinho, campos obrigatórios da API |
| Valor Limite | Quantidade máxima de itens (10), faixa de valor para cupons (R$200, R$600, R$990) |
| Tabela de Decisão | Regras de bloqueio de login (3 tentativas), elegibilidade de cupom por valor |
| Transição de Estados | Fluxo login → autenticado → logout |

---

## 5. Mapa Mental — Dimensões de Cobertura

```
EBAC-SHOP — Estratégia de Testes
│
├── US-0001: Carrinho
│   ├── Funcional
│   │   ├── Adicionar item (caminho feliz)
│   │   ├── Limite de 10 unidades (valor limite)
│   │   ├── Valor máximo R$990 (valor limite)
│   │   └── Geração de cupom (partição de equivalência)
│   │       ├── R$200 a R$600 → 10%
│   │       └── Acima de R$600 → 15%
│   └── Automação: Playwright (POM)
│
├── US-0002: Login
│   ├── Funcional
│   │   ├── Credenciais válidas (caminho feliz)
│   │   ├── Senha incorreta (caminho negativo)
│   │   ├── Usuário inexistente (caminho negativo)
│   │   └── 3 tentativas falhas → bloqueio 15 min (tabela de decisão)
│   ├── Automação: Playwright (POM)
│   └── Performance: K6 (20 VUs / 120s)
│
├── US-0003: API de Cupons
│   ├── Funcional
│   │   ├── GET /coupons (listar todos)
│   │   ├── GET /coupons/{id} (buscar por ID)
│   │   ├── POST /coupons (criar cupom)
│   │   ├── Código duplicado → 400
│   │   ├── Campo obrigatório ausente → 400
│   │   └── Sem autenticação → 401
│   ├── Contrato
│   │   ├── Validação de schema (campos obrigatórios)
│   │   └── Validação de tipos (amount: string numérica)
│   ├── Automação: Supertest + Jest
│   └── Performance: K6 (20 VUs / 120s)
│
└── Mobile: Catálogo de Produtos
    ├── Listagem de produtos
    ├── Busca por nome
    ├── Filtro por categoria
    └── Automação: Appium + WebDriverIO (POM)
```

---

## 6. Pirâmide de Testes

```
        /\
       /  \
      / UI \        ← Playwright: login, carrinho (14 casos)
     /------\
    /  API   \      ← Supertest: cupons + contrato (9 casos)
   /----------\
  / UNITÁRIO   \    ← (fora do escopo do TCC)
 /--------------\
```

---

## 7. Critérios de Entrada e Saída

### Critérios de Entrada (início dos testes)
- Ambiente EBAC-SHOP acessível em `http://lojaebac.ebaconline.art.br`
- Credenciais de teste disponíveis (user1_ebac … user5_ebac)
- Repositório TCC-EBAC-QE configurado com dependências instaladas

### Critérios de Saída (encerramento dos testes)
- 100% dos casos de teste executados
- Bugs críticos (bloqueadores) documentados
- Relatórios gerados (Playwright HTML, Jest JSON, K6 JSON)
- Pipeline CI executado com sucesso na branch `main`

---

## 8. Ambiente de Testes

| Item | Valor |
|------|-------|
| URL pública | http://lojaebac.ebaconline.art.br |
| Banco (Docker) | ernestosbarbosa/lojaebacdb:latest (porta 3306) |
| Aplicação (Docker) | ernestosbarbosa/lojaebac:latest (porta 80) |
| Node.js | 20+ |
| Sistema Operacional CI | Ubuntu Latest (GitHub Actions) |

---

## 9. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|-------------|---------|-----------|
| Ambiente público instável | Média | Alto | Usar ambiente Docker local |
| Cupom duplicado em testes paralelos | Alta | Médio | Gerar código único com `Date.now()` |
| Bloqueio de IP por muitas requisições | Baixa | Alto | Limitar concorrência nos testes de performance |
| Dados de teste removidos entre execuções | Média | Médio | Criar dados no `beforeEach` / setup do teste |

---

## 10. Rastreabilidade

| US | Gherkin | Casos de Teste | Automação | Performance |
|----|---------|----------------|-----------|-------------|
| US-0001 | US001-carrinho.feature (6 cenários) | CT-001-01 a CT-001-06 | UI/tests/cart.spec.js | — |
| US-0002 | US002-login.feature (5 cenários) | CT-002-01 a CT-002-06 | UI/tests/login.spec.js | Performance/login.k6.js |
| US-0003 | US003-cupons.feature (6 cenários) | CT-003-01 a CT-003-09 | API/tests/coupons.test.js | Performance/coupons.k6.js |
