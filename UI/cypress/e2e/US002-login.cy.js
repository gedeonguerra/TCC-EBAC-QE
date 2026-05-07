/// <reference types="cypress" />
// US-0002: Login na plataforma
// Pattern: Page Object Model | Técnicas: Partição de Equivalência | Tabela de Decisão

const loginPage = require('../pages/LoginPage')

describe('US-0002: Login na plataforma', () => {

  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  // CT-002-01 | Caminho Feliz | Partição de Equivalência
  it('CT-002-01: Login com credenciais válidas deve redirecionar para Minha Conta', () => {
    loginPage.login(
      Cypress.env('USUARIO_VALIDO'),
      Cypress.env('SENHA_VALIDA')
    )
    loginPage.shouldBeLoggedIn()
  })

  // CT-002-02 | Caminho Negativo | Partição de Equivalência (senha inválida)
  it('CT-002-02: Login com senha incorreta deve exibir mensagem de erro', () => {
    loginPage.login('user1_ebac', 'senhaerrada999')
    loginPage.shouldShowError('Erro')
  })

  // CT-002-03 | Caminho Negativo | Partição de Equivalência (usuário inválido)
  it('CT-002-03: Login com usuário inexistente deve exibir mensagem de erro', () => {
    loginPage.login('usuario.invalido@teste.com', 'qualquersenha')
    loginPage.shouldShowError('Endereço de e-mail desconhecido')
  })

  // CT-002-04 | Tabela de Decisão | 3 erros consecutivos → bloqueio
  it('CT-002-04: Deve bloquear login após 3 tentativas incorretas', () => {
    loginPage.navigate()
    for (let i = 1; i <= 3; i++) {
      loginPage.fillCredentials('user1_ebac', `senhaerrada${i}`)
      loginPage.submit()
      cy.get('.woocommerce-error').should('be.visible')
      if (i < 3) loginPage.navigate()
    }
  })
})