// Page Object Model — CartPage
// US-0001: Adicionar item ao carrinho

class CartPage {
  get qtyField()        { return cy.get('input.qty') }
  get addToCartButton() { return cy.get('.single_add_to_cart_button') }
  get cartMessage()     { return cy.get('.woocommerce-message') }
  get viewCartButton()  { return cy.get('.woocommerce-message > .button') }
  get checkoutButton()  { return cy.get('.checkout-button') }
  get orderTotal()      { return cy.get('.order-total > td') }
  get errorNotice()     { return cy.get('.woocommerce-error, [role="alert"]') }

  visitProduct(slug) {
    cy.visit(`/product/${slug}/`, { failOnStatusCode: false })
    cy.get('.product', { timeout: 30000 }).should('exist')
  }

  selectVariation(size = 'L', color = 'Black') {
    cy.get(`[title='${size}']`).first().click({ force: true })
    cy.wait(300)
    cy.get(`[title='${color}']`).first().click({ force: true })

    cy.get('.single_add_to_cart_button', { timeout: 15000 })
      .should('not.have.class', 'disabled')
      .and('not.have.class', 'wc-variation-selection-needed')
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

  clearCart() {
    cy.visit('/carrinho/', { failOnStatusCode: false })
    cy.get('body').then(($body) => {
      if ($body.find('a.remove').length > 0) {
        cy.get('a.remove').each(($el) => {
          cy.wrap($el).click({ force: true })
          cy.wait(300)
        })
      }
    })
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