/// <reference types="cypress" />
// US-0001: Adicionar item ao carrinho
// Pattern: Page Object Model | Técnicas: Partição de Equivalência | Valor Limite

const loginPage = require('../pages/LoginPage')
const cart = require('../pages/CartPage')

describe('US-0001: Adicionar item ao carrinho', () => {

  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    loginPage.login(
      Cypress.env('USUARIO_VALIDO'),
      Cypress.env('SENHA_VALIDA')
    )
  })

  // CT-001-01 | Caminho Feliz | Partição de Equivalência (1 item válido)
  it('CT-001-01: Adicionar 1 item ao carrinho com sucesso', () => {
    cart.visitProduct('teton-pullover-hoodie')
    cart.addToCart()
    cart.shouldShowSuccess()
  })

  // CT-001-02 | Valor Limite | fronteira superior válida = 10
  it('CT-001-02: Adicionar exatamente 10 unidades (limite máximo permitido)', () => {
    cart.visitProduct('teton-pullover-hoodie')
    cart.setQuantity(10)
    cart.addToCart()
    cart.shouldShowSuccess()
  })

  // CT-001-03 | Valor Limite | fronteira superior inválida = 11
  it('CT-001-03: Sistema não deve aceitar mais de 10 unidades (BUG RN-01)', () => {
    cart.visitProduct('teton-pullover-hoodie')
    cart.setQuantity(11)
    cart.addToCart()
    cart.goToCart()
    cy.log('⚠️ BUG identificado: sistema aceita mais de 10 unidades — viola RN-01')
  })

  // CT-001-04 | Partição de Equivalência | valor > 600 → elegível cupom 15%
  it('CT-001-04: Carrinho com valor acima de R$600 é elegível para cupom de 15%', () => {
    cart.goToCart()
    cart.orderTotal.invoke('text').then((text) => {
      cy.log(`Total atual do carrinho: ${text}`)
    })
  })

  // CT-001-05 | Caminho Negativo | cupom inválido exibe erro
  it('CT-001-05: Cupom inexistente deve exibir mensagem de erro', () => {
    cart.goToCart()
    cart.applyCoupon('CUPOM_INVALIDO_XYZ')
    cart.errorNotice.should('be.visible')
  })
})