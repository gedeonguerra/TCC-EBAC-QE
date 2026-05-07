/// <reference types="cypress" />
// US-0001: Adicionar item ao carrinho
// Pattern: Page Object Model
// Técnicas: Partição de Equivalência | Valor Limite

const loginPage = require('../pages/LoginPage')
const cart = require('../pages/CartPage')

const PRODUTO_SLUG = Cypress.env('PRODUTO_SLUG') || 'teton-pullover-hoodie'

describe('US-0001: Adicionar item ao carrinho', () => {

  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    loginPage.login(
      Cypress.env('USUARIO_VALIDO'),
      Cypress.env('SENHA_VALIDA')
    )
  })

  it('DEBUG: inspecionar seletores de variação', () => {
    cart.visitProduct(PRODUTO_SLUG)

    // Loga todo o HTML da área de variações
    cy.get('.variations').then(($el) => {
      cy.log('HTML variations:', $el.html())
    })

    // Verifica se .variable-items-wrapper existe
    cy.get('body').then(($body) => {
      const swatches = $body.find('.variable-items-wrapper')
      cy.log('Swatches encontrados:', swatches.length)
      cy.log('HTML swatch[0]:', swatches.length > 0 ? swatches[0].outerHTML : 'NENHUM')

      const selects = $body.find('select[name*="attribute_pa"]')
      cy.log('Selects nativos encontrados:', selects.length)
      selects.each((i, el) => {
        cy.log(`Select[${i}] name:`, el.getAttribute('name'))
      })
    })

    // Tira screenshot para ver a página
    cy.screenshot('debug-variacoes')
  })

  // CT-001-01 | Caminho Feliz | Partição de Equivalência (1 item válido)
  it('CT-001-01: Adicionar 1 item ao carrinho com sucesso', () => {
    cart.visitProduct(PRODUTO_SLUG)
    cart.selectVariation('L', 'Black')   // ← FIX
    cart.addToCart()
    cart.shouldShowSuccess()
  })

  // CT-001-02 | Valor Limite | fronteira superior válida = 10
  it('CT-001-02: Adicionar exatamente 10 unidades (limite máximo permitido)', () => {
    cart.visitProduct(PRODUTO_SLUG)
    cart.selectVariation('L', 'Black')   // ← FIX
    cart.setQuantity(10)
    cart.addToCart()
    cart.shouldShowSuccess()
  })

  // CT-001-03 | Valor Limite | fronteira superior inválida = 11
  it('CT-001-03: Sistema não deve aceitar mais de 10 unidades (BUG RN-01)', () => {
    cart.visitProduct(PRODUTO_SLUG)
    cart.selectVariation('L', 'Black')   // ← FIX
    cart.setQuantity(11)
    cart.addToCart()
    cart.goToCart()

    cart.qtyField
      .invoke('val')
      .then(parseInt)
      .should('be.lte', 10, '⚠️ BUG RN-01: sistema aceitou mais de 10 unidades')
  })

  // CT-001-04 | Partição de Equivalência | valor > R$600 → elegível cupom 15%
  it('CT-001-04: Carrinho com valor acima de R$600 é elegível para cupom de 15%', () => {
    cart.visitProduct(PRODUTO_SLUG)
    cart.selectVariation('L', 'Black')   // ← FIX
    cart.setQuantity(10)
    cart.addToCart()
    cart.shouldShowSuccess()
    cart.goToCart()

    cart.orderTotal.invoke('text').then((text) => {
      cy.log(`Total atual do carrinho: ${text}`)
      const valor = parseFloat(text.replace(/[^\d,]/g, '').replace(',', '.'))
      expect(valor).to.be.greaterThan(600)
    })
  })

  // CT-001-05 | Caminho Negativo | cupom inválido deve exibir erro
  it('CT-001-05: Cupom inexistente deve exibir mensagem de erro', () => {
    cart.visitProduct(PRODUTO_SLUG)
    cart.selectVariation('L', 'Black')   // ← FIX
    cart.addToCart()
    cart.shouldShowSuccess()
    cart.goToCart()

    cart.applyCoupon('CUPOM_INVALIDO_XYZ')
    cart.errorNotice.should('be.visible')
  })
})