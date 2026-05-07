// Page Object Model — CartPage
// US-0001: Adicionar item ao carrinho

class CartPage {
  get qtyField() { return cy.get('input.qty') }
  get addToCartButton() { return cy.get('.single_add_to_cart_button') }
  get cartMessage() { return cy.get('.woocommerce-message') }
  get viewCartButton() { return cy.get('.woocommerce-message > .button') }
  get checkoutButton() { return cy.get('.checkout-button') }
  get orderTotal() { return cy.get('.order-total > td') }
  get errorNotice() { return cy.get('.woocommerce-error') }

  visitProduct(slug) {
    cy.visit(`/product/${slug}/`, { failOnStatusCode: false })
    cy.wait(2000)
    cy.get('.variations', { timeout: 20000 }).should('exist')
  }

  selectVariation(size = 'L', color = 'Black') {
    // Clica no li visível do plugin de swatches
    cy.get('.variations tr').contains('Size')
      .closest('tr')
      .find('ul.variable-items-wrapper li')
      .contains(new RegExp(`^${size}$`))
      .click({ force: true })

    // Pequena espera para o plugin processar o clique
    cy.wait(500)

    cy.get('.variations tr').contains('Color')
      .closest('tr')
      .find('ul.variable-items-wrapper li')
      .contains(new RegExp(`^${color}$`))
      .click({ force: true })

    cy.wait(500)

    // Verifica que a classe 'selected' foi aplicada em pelo menos um li
    cy.get('.variations tr').contains('Size')
      .closest('tr')
      .find('ul.variable-items-wrapper li.selected')
      .should('exist')

    cy.get('.single_add_to_cart_button', { timeout: 15000 })
      .should('not.have.class', 'wc-variation-selection-needed')
      .and('not.have.class', 'disabled')
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