class CartPage {

  // ── Getters ───────────────────────────────────────────────────────────────
  get qtyField()        { return cy.get('[type="number"]').first() }
  get addToCartButton() { return cy.get('.single_add_to_cart_button') }
  get checkoutButton()  { return cy.get('.checkout-button') }
  get orderTotal()      { return cy.get('.order-total > td') }
  get errorNotice()     { return cy.get('[role="alert"]') }

  // ── visitProduct ──────────────────────────────────────────────────────────
  visitProduct(slug) {
    cy.visit(`/product/${slug}/`, { failOnStatusCode: false })
    cy.url({ timeout: 30000 }).should('include', slug)
    cy.get('.single_add_to_cart_button', { timeout: 30000 }).should('exist')
  }

  // ── selectVariation ───────────────────────────────────────────────────────
  // Clica no swatch visual + aciona change no <select> oculto
  // (WooCommerce Variation Swatches oculta o select nativo com display:none)
  selectVariation(size = 'L', color = 'Black') {
    cy.get(`[title='${size}']`, { timeout: 10000 }).first().click({ force: true })
    cy.get('select[name="attribute_size"]').invoke('val', size).trigger('change', { force: true })
    cy.wait(400)

    cy.get(`[title='${color}']`, { timeout: 10000 }).first().click({ force: true })
    cy.get('select[name="attribute_color"]').invoke('val', color).trigger('change', { force: true })
    cy.wait(400)

    cy.get('.single_add_to_cart_button', { timeout: 15000 })
      .should('not.have.class', 'disabled')
      .and('not.have.class', 'wc-variation-selection-needed')
      .and('be.visible')
  }

  // ── setQuantity ───────────────────────────────────────────────────────────
  setQuantity(qty) {
    this.qtyField.clear().type(String(qty))
  }

  // ── addToCart ─────────────────────────────────────────────────────────────
  addToCart() {
    this.addToCartButton.should('be.visible').click()
  }

  // ── clearCart ─────────────────────────────────────────────────────────────
  // Remove itens um por vez re-consultando o DOM a cada clique.
  // Após limpar, navega para home para estabilizar a sessão WooCommerce
  // antes do próximo visitProduct (evita estado instável pós-redirect).
  clearCart() {
    cy.visit('/carrinho/', { failOnStatusCode: false })
    const removeOne = () => {
      cy.get('body').then($body => {
        if ($body.find('a.remove').length > 0) {
          cy.get('a.remove').first().click({ force: true })
          cy.wait(800)
          removeOne()
        }
      })
    }
    removeOne()
    cy.visit('/', { failOnStatusCode: false })
    cy.wait(500)
  }

  // ── goToCart ──────────────────────────────────────────────────────────────
  goToCart() {
    cy.visit('/carrinho/', { failOnStatusCode: false })
  }

  goToCheckout() {
    this.checkoutButton.should('be.visible').click()
  }

  // ── Assertions ────────────────────────────────────────────────────────────
  shouldShowSuccess() {
    cy.get('[role="alert"]', { timeout: 20000 }).should('exist').and('be.visible')
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