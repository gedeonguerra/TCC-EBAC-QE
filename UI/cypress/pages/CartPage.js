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
    cy.visit(`/product/${slug}/`, { failOnStatusCode: false })
    cy.get('.variations', { timeout: 20000 }).should('exist')
  }

  selectVariation(size = 'L', color = 'Black') {
    // Plugin woo-variation-swatches: botões visuais são <li> dentro de .variable-items-wrapper
    // O <select> nativo fica com display:none — clicar nos <li> visíveis
    cy.get('.variations tr').contains('Size')
      .closest('tr')
      .find('ul.variable-items-wrapper li')
      .contains(new RegExp(`^${size}$`))
      .click({ force: true })

    cy.get('.variations tr').contains('Color')
      .closest('tr')
      .find('ul.variable-items-wrapper li')
      .contains(new RegExp(`^${color}$`))
      .click({ force: true })

    cy.get('.single_add_to_cart_button', { timeout: 10000 })
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