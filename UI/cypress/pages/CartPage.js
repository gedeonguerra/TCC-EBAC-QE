// Page Object Model — CartPage
// US-0001: Adicionar item ao carrinho

class CartPage {
  get qtyField()        { return cy.get('input.qty') }
  get addToCartButton() { return cy.get('.single_add_to_cart_button') }
  get cartMessage()     { return cy.get('.woocommerce-message') }
  get viewCartButton()  { return cy.get('.woocommerce-message > .button') }
  get checkoutButton()  { return cy.get('.checkout-button') }
  get orderTotal()      { return cy.get('.order-total > td') }
  get errorNotice()     { return cy.get('.woocommerce-error') }

  visitProduct(slug) {
    cy.visit(`/produto/${slug}/`)
    cy.get('.single_add_to_cart_button', { timeout: 15000 }).should('exist')
  }

  // FIX: selecionar variação antes de adicionar ao carrinho
  // Produto variável exige Size + Color para habilitar o botão
  selectVariation(size = 'L', color = 'Black') {
    // Aguarda as swatches renderizarem
    cy.get('.variable-items-wrapper', { timeout: 10000 }).should('be.visible')

    // Seleciona Size
    cy.get('.variable-items-wrapper[data-attribute_name="attribute_pa_size"]')
      .contains(size)
      .click()

    // Seleciona Color
    cy.get('.variable-items-wrapper[data-attribute_name="attribute_pa_color"]')
      .contains(color)
      .click()

    // Aguarda botão ser habilitado (WooCommerce remove classe 'disabled')
    cy.get('.single_add_to_cart_button')
      .should('not.have.class', 'disabled')
      .and('be.visible')
  }

  setQuantity(qty) {
    this.qtyField.clear().type(String(qty))
  }

  addToCart() {
    this.addToCartButton.should('be.visible').click()
  }

  goToCart() {
    cy.visit('/carrinho/', { failOnStatusCode: false })
  }

  goToCheckout() {
    this.checkoutButton.should('be.visible').click()
  }

  shouldShowSuccess() {
    this.cartMessage.should('be.visible')
  }

  shouldShowTotal(total) {
    this.orderTotal.should('contain', total)
  }

  shouldBeAtCheckout() {
    cy.url().should('include', '/checkout')
  }

  applyCoupon(code) {
    cy.get('#coupon_code').should('be.visible').type(code)
    cy.get('[name="apply_coupon"]').click()
  }
}

module.exports = new CartPage()