# Casos de Teste — TCC EBAC Shop
**Projeto:** EBAC-SHOP (WooCommerce)
**Versão:** 1.0
**Elaborado por:** Engenheiro de Qualidade de Software — EBAC
**Data:** 2025-05-06

---

## US-0001 — Adicionar item ao carrinho

| ID | Título | Técnica | Tipo | Pré-condições | Passos | Resultado Esperado |
|----|--------|---------|------|---------------|--------|--------------------|
| CT-001-01 | Adicionar 1 unidade ao carrinho com sucesso | Partição de Equivalência (classe válida: 1 item) | Feliz | Usuário autenticado; produto "Teton Pullover Hoodie" disponível em estoque | 1. Acessar página do produto. 2. Selecionar tamanho XS e cor Red. 3. Definir quantidade = 1. 4. Clicar em "Adicionar ao carrinho". 5. Acessar o carrinho. | Item aparece no carrinho; total calculado corretamente. |
| CT-001-02 | Adicionar exatamente 10 unidades (limite máximo) | Valor Limite (fronteira superior válida = 10) | Feliz | Usuário autenticado; produto disponível | 1. Acessar página do produto. 2. Definir quantidade = 10. 3. Clicar em "Adicionar ao carrinho". 4. Acessar o carrinho. | Sistema aceita 10 unidades sem exibir erro; quantidade exibida = 10. |
| CT-001-03 | Tentar adicionar 11 unidades — acima do limite | Valor Limite (fronteira superior inválida = 11) | Negativo | Usuário autenticado; produto disponível | 1. Acessar página do produto. 2. Definir quantidade = 11. 3. Clicar em "Adicionar ao carrinho". | Sistema bloqueia a adição OU exibe mensagem de erro informando quantidade máxima excedida (RN-01). |
| CT-001-04 | Valor total entre R$200 e R$600 gera cupom de 10% | Partição de Equivalência (classe: 200 ≤ valor ≤ 600) | Alternativo | Carrinho com produtos cujo total some R$300,00 | 1. Adicionar produtos até total = R$300,00. 2. Acessar o carrinho. 3. Visualizar resumo do pedido. | Cupom de 10% de desconto é exibido automaticamente no resumo (RN-03). |
| CT-001-05 | Valor total acima de R$600 gera cupom de 15% | Partição de Equivalência (classe: valor > 600) | Alternativo | Carrinho com produtos cujo total some R$700,00 | 1. Adicionar produtos até total = R$700,00. 2. Acessar o carrinho. 3. Visualizar resumo do pedido. | Cupom de 15% de desconto é exibido automaticamente no resumo (RN-04). |
| CT-001-06 | Valor total não pode ultrapassar R$990,00 | Valor Limite (fronteira superior do valor total = R$990) | Negativo | Usuário autenticado; produtos disponíveis | 1. Tentar adicionar produtos que totalizem R$1.000,00. 2. Confirmar o pedido. | Sistema bloqueia a operação e exibe mensagem informando valor máximo excedido (RN-02). |

---

## US-0002 — Login na plataforma

| ID | Título | Técnica | Tipo | Pré-condições | Passos | Resultado Esperado |
|----|--------|---------|------|---------------|--------|--------------------|
| CT-002-01 | Login com credenciais válidas | Partição de Equivalência (classe válida) | Feliz | Usuário "user1_ebac" ativo e cadastrado | 1. Acessar a página de login. 2. Inserir usuário "user1_ebac". 3. Inserir senha "psw!ebac@test". 4. Clicar em "Login". | Usuário é redirecionado para "Minha Conta"; pedidos ficam visíveis (RN-01). |
| CT-002-02 | Login com senha incorreta exibe mensagem de erro | Partição de Equivalência (classe inválida: senha errada) | Negativo | Usuário "user1_ebac" ativo e cadastrado | 1. Acessar a página de login. 2. Inserir usuário "user1_ebac". 3. Inserir senha "senhaerrada123". 4. Clicar em "Login". | Mensagem de erro é exibida; usuário permanece na página de login (RN-02). |
| CT-002-03 | Login com usuário inexistente exibe mensagem de erro | Partição de Equivalência (classe inválida: usuário não existe) | Negativo | Nenhuma | 1. Acessar a página de login. 2. Inserir usuário "usuario.invalido@teste.com". 3. Inserir qualquer senha. 4. Clicar em "Login". | Mensagem de erro é exibida; acesso negado (RN-02). |
| CT-002-04 | Login bloqueado após 3 tentativas incorretas consecutivas | Tabela de Decisão (3 falhas consecutivas → bloqueio 15 min) | Negativo | Usuário "user1_ebac" ativo | 1. Errar senha 1 vez → verificar erro. 2. Errar senha 2 vez → verificar erro. 3. Errar senha 3 vez → verificar bloqueio. | Após 3 erros consecutivos, login é travado por 15 minutos; mensagem de bloqueio exibida (RN-03). |
| CT-002-05 | Usuário inativo não consegue fazer login | Tabela de Decisão (status inativo → acesso negado) | Negativo | Usuário com status "inativo" cadastrado no sistema | 1. Acessar a página de login. 2. Inserir credenciais do usuário inativo. 3. Clicar em "Login". | Sistema nega o acesso; mensagem de conta inativa exibida (RN-01). |
| CT-002-06 | Campos em branco não realizam login | Partição de Equivalência (classe inválida: campos vazios) | Negativo | Nenhuma | 1. Acessar a página de login. 2. Deixar usuário e senha em branco. 3. Clicar em "Login". | Usuário permanece na página de login; nenhuma sessão é iniciada. |

---

## US-0003 — API de Cupons

| ID | Título | Técnica | Tipo | Pré-condições | Passos | Resultado Esperado |
|----|--------|---------|------|---------------|--------|--------------------|
| CT-003-01 | GET /coupons retorna lista de cupons autenticado | Partição de Equivalência (GET válido autenticado) | Feliz | Admin autenticado com Basic Auth | 1. Enviar GET para `/wp-json/wc/v3/coupons` com header `Authorization: Basic ...`. | Status 200; body retorna array de objetos com campos: id, code, amount, discount_type, description. |
| CT-003-02 | GET /coupons/{id} retorna cupom específico | Partição de Equivalência (ID existente) | Feliz | Admin autenticado; cupom com ID conhecido cadastrado | 1. Enviar GET para `/wp-json/wc/v3/coupons/{id}` com auth. | Status 200; body contém objeto com id correspondente ao solicitado; contrato validado. |
| CT-003-03 | POST /coupons cria cupom com campos obrigatórios | Partição de Equivalência (POST válido) | Feliz | Admin autenticado; código de cupom único | 1. Enviar POST para `/wp-json/wc/v3/coupons` com body: `{code, amount, discount_type, description}`. | Status 201; body retorna o cupom criado com id gerado; contrato validado (RN-02). |
| CT-003-04 | POST com código duplicado retorna erro 400 | Tabela de Decisão (code já existente → rejeição) | Negativo | Admin autenticado; cupom com código "CUPOMDUP" já cadastrado | 1. Enviar POST com code = "CUPOMDUP". 2. Enviar segundo POST com mesmo code = "CUPOMDUP". | Segunda requisição retorna status 400; body contém mensagem de erro indicando código duplicado (RN-03). |
| CT-003-05 | POST sem campo obrigatório retorna erro 400 | Partição de Equivalência (campo obrigatório ausente) | Negativo | Admin autenticado | 1. Enviar POST para `/wp-json/wc/v3/coupons` sem o campo `code`. | Status 400; body indica campo obrigatório ausente (RN-02). |
| CT-003-06 | GET sem autenticação retorna 401 | Tabela de Decisão (sem auth → 401) | Negativo | Nenhuma | 1. Enviar GET para `/wp-json/wc/v3/coupons` sem header de autorização. | Status 401; acesso negado. |
| CT-003-07 | GET com ID inexistente retorna 404 | Partição de Equivalência (ID inválido) | Negativo | Admin autenticado | 1. Enviar GET para `/wp-json/wc/v3/coupons/9999999`. | Status 404; body contém campo `message`. |
| CT-003-08 | Contrato: campo amount deve ser string numérica válida | Validação de Contrato | Alternativo | Admin autenticado; ao menos um cupom cadastrado | 1. Enviar GET para `/wp-json/wc/v3/coupons`. 2. Para cada item do array, verificar tipo do campo `amount`. | Campo `amount` é do tipo string e seu valor é parseável como número float. |
| CT-003-09 | POST com corpo vazio retorna erro de validação | Partição de Equivalência (body vazio) | Negativo | Admin autenticado | 1. Enviar POST para `/wp-json/wc/v3/coupons` com body `{}`. | Status 400 ou 422; body indica erro de validação. |

---

## Índice de Rastreabilidade

| US | Cenário Gherkin | Caso de Teste | Caso Automatizado |
|----|----------------|---------------|-------------------|
| US-0001 | US001-carrinho.feature — CT-001 | CT-001-01 | UI/tests/cart.spec.js — CT-001 |
| US-0001 | US001-carrinho.feature — CT-002 | CT-001-02 | UI/tests/cart.spec.js — CT-002 |
| US-0001 | US001-carrinho.feature — CT-003 | CT-001-03 | UI/tests/cart.spec.js — CT-003 |
| US-0001 | US001-carrinho.feature — CT-004 | CT-001-04 | UI/tests/cart.spec.js — CT-004 |
| US-0001 | US001-carrinho.feature — CT-005 | CT-001-05 | UI/tests/cart.spec.js — CT-005 |
| US-0001 | US001-carrinho.feature — CT-006 | CT-001-06 | UI/tests/cart.spec.js — CT-006 |
| US-0002 | US002-login.feature — CT-001 | CT-002-01 | UI/tests/login.spec.js — CT-001 |
| US-0002 | US002-login.feature — CT-002 | CT-002-02 | UI/tests/login.spec.js — CT-002 |
| US-0002 | US002-login.feature — CT-003 | CT-002-03 | UI/tests/login.spec.js — CT-003 |
| US-0002 | US002-login.feature — CT-004 | CT-002-04 | UI/tests/login.spec.js — CT-004 |
| US-0002 | US002-login.feature — CT-005 | CT-002-05 | — (usuário inativo) |
| US-0002 | — | CT-002-06 | UI/tests/login.spec.js — CT-004 |
| US-0003 | US003-cupons.feature — CT-001 | CT-003-01 | API/tests/coupons.test.js — CT-005 |
| US-0003 | US003-cupons.feature — CT-002 | CT-003-02 | API/tests/coupons.test.js — CT-006 |
| US-0003 | US003-cupons.feature — CT-003 | CT-003-03 | API/tests/coupons.test.js — CT-001 |
| US-0003 | US003-cupons.feature — CT-004 | CT-003-04 | API/tests/coupons.test.js — CT-002 |
| US-0003 | US003-cupons.feature — CT-005 | CT-003-05 | API/tests/coupons.test.js — CT-004 |
| US-0003 | US003-cupons.feature — CT-006 | CT-003-06 | API/tests/coupons.test.js — CT-008 |
