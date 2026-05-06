# language: pt
Feature: US-0003 - API de Cupons
  Como admin da EBAC-SHOP
  Quero criar um serviço de cupom
  Para poder listar e cadastrar os cupons

  Background:
    Given que o admin está autenticado com as credenciais da API

  # ─── GET TODOS ───────────────────────────────────────────
  Scenario: CT-001 - Listar todos os cupons cadastrados
    # Técnica: Partição de Equivalência (GET válido autenticado)
    When o admin faz uma requisição GET para "/wc/v3/coupons"
    Then a resposta deve ter status "200"
    And o body deve retornar um array de cupons

  # ─── GET POR ID ──────────────────────────────────────────
  Scenario: CT-002 - Buscar cupom específico por ID válido
    # Técnica: Partição de Equivalência (ID existente)
    Given que existe um cupom com ID válido cadastrado
    When o admin faz uma requisição GET para "/wc/v3/coupons/{id}"
    Then a resposta deve ter status "200"
    And o body deve conter o cupom com o ID solicitado

  # ─── POST FELIZ ──────────────────────────────────────────
  Scenario: CT-003 - Cadastrar cupom com todos os campos obrigatórios
    # Técnica: Partição de Equivalência (POST válido com campos obrigatórios)
    When o admin envia POST para "/wc/v3/coupons" com:
      | code          | CUPOM10          |
      | amount        | 10.00            |
      | discount_type | fixed_product    |
      | description   | Cupom de teste   |
    Then a resposta deve ter status "201"
    And o body deve conter o campo "id"
    And o campo "code" deve conter "cupom10"

  # ─── POST DUPLICADO ──────────────────────────────────────
  Scenario: CT-004 - Não deve cadastrar cupom com código duplicado
    # Técnica: Tabela de Decisão (code já existente → rejeição)
    Given que já existe um cupom com o código "CUPOMDUP"
    When o admin tenta cadastrar outro cupom com o mesmo código "CUPOMDUP"
    Then a resposta deve ter status "400"
    And o body deve conter mensagem "O código de cupom já existe"

  # ─── POST SEM CAMPO OBRIGATÓRIO ──────────────────────────
  Scenario: CT-005 - Não deve cadastrar cupom sem campo obrigatório
    # Técnica: Partição de Equivalência (POST inválido: sem "code")
    When o admin envia POST para "/wc/v3/coupons" sem o campo "code"
    Then a resposta deve ter status "400"

  # ─── SEM AUTENTICAÇÃO ────────────────────────────────────
  Scenario: CT-006 - Requisição sem autenticação deve ser rejeitada
    # Técnica: Tabela de Decisão (sem auth → 401)
    Given que o admin não está autenticado
    When o admin faz uma requisição GET para "/wc/v3/coupons"
    Then a resposta deve ter status "401"
