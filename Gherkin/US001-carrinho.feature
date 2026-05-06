# language: pt
Feature: US-0001 - Adicionar item ao carrinho
  Como cliente da EBAC-SHOP
  Quero adicionar produtos no carrinho
  Para realizar a compra dos itens

  Background:
    Given que o cliente está na página inicial da EBAC-SHOP

  # ─── CAMINHO FELIZ ───────────────────────────────────────
  Scenario: CT-001 - Adicionar 1 item ao carrinho com sucesso
    # Técnica: Partição de Equivalência (classe válida: 1 item)
    When o cliente adiciona 1 unidade do produto "Teton Pullover Hoodie"
    Then o item deve aparecer no carrinho
    And o total do carrinho deve ser exibido corretamente

  # ─── VALOR LIMITE ────────────────────────────────────────
  Scenario: CT-002 - Adicionar exatamente 10 unidades (limite máximo)
    # Técnica: Valor Limite (fronteira superior válida)
    When o cliente adiciona 10 unidades do produto "Teton Pullover Hoodie"
    Then o sistema deve aceitar a quantidade
    And o carrinho deve exibir 10 unidades do produto

  Scenario: CT-003 - Tentar adicionar 11 unidades (além do limite)
    # Técnica: Valor Limite (fronteira superior inválida)
    When o cliente tenta adicionar 11 unidades do produto "Teton Pullover Hoodie"
    Then o sistema deve bloquear a adição
    And deve exibir mensagem de erro de quantidade máxima

  # ─── CUPOM 10% ───────────────────────────────────────────
  Scenario: CT-004 - Valor entre R$200 e R$600 gera cupom de 10%
    # Técnica: Partição de Equivalência (classe: 200 <= valor <= 600)
    Given que o carrinho possui produtos com valor total de "R$300,00"
    When o cliente visualiza o resumo do pedido
    Then deve ser exibido cupom de desconto de "10%"

  # ─── CUPOM 15% ───────────────────────────────────────────
  Scenario: CT-005 - Valor acima de R$600 gera cupom de 15%
    # Técnica: Partição de Equivalência (classe: valor > 600)
    Given que o carrinho possui produtos com valor total de "R$700,00"
    When o cliente visualiza o resumo do pedido
    Then deve ser exibido cupom de desconto de "15%"

  # ─── VALOR MÁXIMO ────────────────────────────────────────
  Scenario: CT-006 - Valor total não pode ultrapassar R$990,00
    # Técnica: Valor Limite (fronteira superior do valor total)
    When o cliente tenta adicionar produtos que somam "R$1000,00"
    Then o sistema deve bloquear a operação
    And deve exibir mensagem de valor máximo excedido
