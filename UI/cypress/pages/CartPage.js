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

  // Resiliente: tenta swatches (plugin), cai para <select> nativo do WooCommerce
  selectVariation(size = 'L', color = 'Black') {
    cy.get('.variations', { timeout: 15000 }).should('exist')

    cy.get('body').then(($body) => {
      const hasSwatches = $body.find('.variable-items-wrapper').length > 0

      if (hasSwatches) {
        // ── Caminho com plugin de swatches ──────────────────────────────
        cy.get('.variable-items-wrapper[data-attribute_name="attribute_pa_size"]')
          .contains(size)
          .click()

        cy.get('.variable-items-wrapper[data-attribute_name="attribute_pa_color"]')
          .contains(color)
          .click()
      } else {
        // ── Caminho com <select> nativo WooCommerce ──────────────────────
        cy.get('select[name="attribute_pa_size"]')
          .should('be.visible')
          .select(size.toLowerCase())

        cy.get('select[name="attribute_pa_color"]')
          .should('be.visible')
          .select(color.toLowerCase())
      }
    })

    // Em ambos os casos: aguarda o botão ficar habilitado
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