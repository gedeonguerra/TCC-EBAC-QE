# language: pt
Feature: US-0002 - Login na plataforma
  Como cliente da EBAC-SHOP
  Quero fazer o login na plataforma
  Para visualizar meus pedidos

  Background:
    Given que o cliente está na página de login da EBAC-SHOP

  # ─── CAMINHO FELIZ ───────────────────────────────────────
  Scenario: CT-001 - Login com credenciais válidas
    # Técnica: Partição de Equivalência (classe válida)
    When o cliente informa o usuário "user1_ebac" e senha "psw!ebac@test"
    And clica no botão "Login"
    Then deve ser redirecionado para "Minha Conta"
    And deve visualizar seus pedidos

  # ─── CAMINHO NEGATIVO ────────────────────────────────────
  Scenario: CT-002 - Login com senha incorreta exibe mensagem de erro
    # Técnica: Partição de Equivalência (classe inválida: senha errada)
    When o cliente informa o usuário "user1_ebac" e senha "senhaerrada123"
    And clica no botão "Login"
    Then deve ser exibida mensagem de erro "Erro: O usuário"
    And o cliente permanece na página de login

  Scenario: CT-003 - Login com usuário inexistente exibe mensagem de erro
    # Técnica: Partição de Equivalência (classe inválida: usuário não existe)
    When o cliente informa o usuário "usuario.invalido@teste.com" e senha "qualquersenha"
    And clica no botão "Login"
    Then deve ser exibida mensagem de erro "Erro: O usuário"

  # ─── BLOQUEIO 3 TENTATIVAS ───────────────────────────────
  Scenario: CT-004 - Conta bloqueada após 3 tentativas incorretas
    # Técnica: Tabela de Decisão (3 falhas consecutivas → bloqueio)
    When o cliente erra a senha "3" vezes consecutivas para o usuário "user1_ebac"
    Then o sistema deve bloquear o login por "15 minutos"
    And deve exibir mensagem de bloqueio por tempo

  # ─── USUÁRIO INATIVO ─────────────────────────────────────
  Scenario: CT-005 - Usuário inativo não consegue fazer login
    # Técnica: Tabela de Decisão (status inativo → acesso negado)
    Given que o usuário "usuario.inativo@ebac.com" está com status inativo
    When o cliente tenta fazer login com suas credenciais
    Then o sistema deve negar o acesso
    And deve exibir mensagem de conta inativa
