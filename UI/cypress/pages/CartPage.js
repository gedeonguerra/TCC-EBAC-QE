class CartPage {

  // ── Getters ───────────────────────────────────────────────────────────────
  get qtyField()        { return cy.get('[type="number"]') }
  get addToCartButton() { return cy.get('.single_add_to_cart_button') }
  get cartMessage()     { return cy.get('[role="alert"]') }
  get viewCartButton()  { return cy.get('.woocommerce-message > .button') }
  get checkoutButton()  { return cy.get('.checkout-button') }
  get orderTotal()      { return cy.get('.order-total > td') }
  get errorNotice()     { return cy.get('[role="alert"]') }

  // ── visitProduct ──────────────────────────────────────────────────────────
  visitProduct(slug) {
    cy.visit(`/product/${slug}/`, { failOnStatusCode: false })
    cy.url({ timeout: 30000 }).should('include', slug)
    cy.get('table.variations', { timeout: 15000 }).should('exist')
    cy.get('.single_add_to_cart_button', { timeout: 30000 }).should('exist')
  }

  // ── selectVariation ───────────────────────────────────────────────────────
  // 1. Clica no swatch visual [title='X']
  // 2. Seta o valor no <select> oculto + dispara change
  //    → WooCommerce escuta o change e habilita o botão
  selectVariation(size = 'L', color = 'Black') {

    // Tamanho
    cy.get(`[title='${size}']`, { timeout: 10000 })
      .first()
      .click({ force: true })

    cy.get('select[name="attribute_size"]')
      .invoke('val', size)
      .trigger('change', { force: true })

    cy.wait(400)

    // Cor
    cy.get(`[title='${color}']`, { timeout: 10000 })
      .first()
      .click({ force: true })

    cy.get('select[name="attribute_color"]')
      .invoke('val', color)
      .trigger('change', { force: true })

    cy.wait(400)

    // Aguarda botão sair do estado disabled
    cy.get('.single_add_to_cart_button', { timeout: 15000 })
      .should('not.have.class', 'disabled')
      .and('not.have.class', 'wc-variation-selection-needed')
      .and('be.visible')
  }

  // ── Ações ─────────────────────────────────────────────────────────────────
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

  // ── Assertions ────────────────────────────────────────────────────────────
  shouldShowSuccess() {
    // Seletor confirmado via DevTools: [role='alert']
    cy.get('[role="alert"]', { timeout: 20000 })
      .should('exist')
      .and('be.visible')
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