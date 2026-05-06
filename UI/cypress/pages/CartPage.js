// Page Object Model — CartPage
// US-0001: Adicionar item ao carrinho

class CartPage {
  // ─── Seletores ───────────────────────────────────────────
  get qtyField()         { return cy.get('input.qty') }
  get addToCartButton()  { return cy.get('.single_add_to_cart_button') }
  get cartMessage()      { return cy.get('.woocommerce-message') }
  get viewCartButton()   { return cy.get('.woocommerce-message > .button') }
  get checkoutButton()   { return cy.get('.checkout-button') }
  get orderTotal()       { return cy.get('.order-total > td') }
  get cartItemsCount()   { return cy.get('.dropdown-toggle > .mini-cart-items') }
  get errorNotice()      { return cy.get('.woocommerce-error') }

  // ─── Ações ───────────────────────────────────────────────
  visitProduct(slug) {
    cy.visit(`/produto/${slug}/`)
  }

  selectVariation(size, color) {
    cy.get(`.button-variable-item-${size}`).should('be.visible').click()
    cy.get(`.button-variable-item-${color}`).should('be.visible').click()
  }

  setQuantity(qty) {
    this.qtyField.clear().type(String(qty))
  }

  addToCart() {
    this.addToCartButton
      .should('be.visible')
      .should('not.be.disabled')
      .click()
  }

  goToCart() {
    this.viewCartButton.should('be.visible').click()
  }

  goToCheckout() {
    this.checkoutButton.should('be.visible').click()
  }

  // ─── Asserções ───────────────────────────────────────────
  shouldShowSuccess() {
    this.cartMessage.should('be.visible')
  }

  shouldShowQuantity(qty) {
    this.cartItemsCount.should('contain', String(qty))
  }

  shouldShowTotal(total) {
    this.orderTotal.should('contain', total)
  }

  shouldBeAtCheckout() {
    cy.url().should('include', '/checkout')
  }
}

module.exports = new CartPage()
