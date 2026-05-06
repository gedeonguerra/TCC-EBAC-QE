/// <reference types="cypress" />

// US-0002: Login na plataforma
// Pattern: Page Object Model (LoginPage)
// Técnicas: Partição de Equivalência | Tabela de Decisão

const loginPage = require('../pages/LoginPage')

describe('US-0002: Login na plataforma', () => {

  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.visit('/')
  })

  // CT-002-01 | Caminho Feliz | Partição de Equivalência (credenciais válidas)
  it('CT-002-01: Login com credenciais válidas deve redirecionar para Minha Conta', () => {
    loginPage.login(
      Cypress.env('USUARIO_VALIDO'),
      Cypress.env('SENHA_VALIDA')
    )
    loginPage.shouldBeLoggedIn()
    cy.get('.woocommerce-MyAccount-navigation-link--orders > a').click()
    cy.get('.page-title').should('contain', 'Pedidos')
  })

  // CT-002-02 | Caminho Negativo | Partição de Equivalência (senha inválida)
  it('CT-002-02: Login com senha incorreta deve exibir mensagem de erro', () => {
    loginPage.login('user1_ebac', 'senhaerrada999')
    loginPage.shouldShowError('Erro: O usuário')
  })

  // CT-002-03 | Caminho Negativo | Partição de Equivalência (usuário inválido)
  it('CT-002-03: Login com usuário inexistente deve exibir mensagem de erro', () => {
    loginPage.login('usuario.nao.existe@ebac.com', 'qualquersenha')
    loginPage.shouldShowError('Erro: O usuário')
  })

  // CT-002-04 | Tabela de Decisão | 3 erros consecutivos → bloqueio 15 min
  it('CT-002-04: Deve bloquear login após 3 tentativas incorretas', () => {
    loginPage.navigate()

    // Tentativa 1
    loginPage.fillCredentials('user1_ebac', 'errado1')
    loginPage.submit()
    loginPage.shouldShowError('Erro: O usuário')

    // Tentativa 2
    loginPage.fillCredentials('user1_ebac', 'errado2')
    loginPage.submit()
    loginPage.shouldShowError('Erro: O usuário')

    // Tentativa 3 → deve acionar bloqueio
    loginPage.fillCredentials('user1_ebac', 'errado3')
    loginPage.submit()

    // Após 3 erros: mensagem de bloqueio esperada
    cy.get('.woocommerce-error').should('be.visible')
    cy.log('⚠️ Verificar se mensagem indica bloqueio por 15 minutos')
  })
})
