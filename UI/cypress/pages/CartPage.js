// Page Object Model — CartPage
// US-0001: Adicionar item ao carrinho
// FIX: seletores corrigidos para attribute_size e attribute_color
//      conforme DOM real de lojaebac.ebaconline.art.br

class CartPage {

  // ── Getters ──────────────────────────────────────────────────────────────
  get qtyField()        { return cy.get('input.qty') }
  get addToCartButton() { return cy.get('.single_add_to_cart_button') }
  get cartMessage()     { return cy.get('.woocommerce-message') }
  get viewCartButton()  { return cy.get('.woocommerce-message > .button') }
  get checkoutButton()  { return cy.get('.checkout-button') }
  get orderTotal()      { return cy.get('.order-total > td') }
  get errorNotice()     { return cy.get('.woocommerce-error, [role="alert"]') }

  // ── visitProduct ─────────────────────────────────────────────────────────
  visitProduct(slug) {
    cy.visit(`/product/${slug}/`, { failOnStatusCode: false })
    cy.url({ timeout: 30000 }).should('include', slug)
    cy.get('form.variations_form', { timeout: 15000 }).should('exist')
    cy.get('.single_add_to_cart_button', { timeout: 30000 }).should('exist')
  }

  // ── selectVariation ──────────────────────────────────────────────────────
  // Seletores corretos confirmados via DevTools:
  //   select[name="attribute_size"]  → valores: XS | S | M | L | XL
  //   select[name="attribute_color"] → valores: Black | Purple | Red
  selectVariation(size = 'L', color = 'Black') {

    // Tamanho
    cy.get('select[name="attribute_size"]', { timeout: 10000 })
      .should('be.visible')
      .select(size)

    cy.wait(300)

    // Cor
    cy.get('select[name="attribute_color"]', { timeout: 10000 })
      .should('be.visible')
      .select(color)

    cy.wait(300)

    // Aguarda botão sair do estado disabled (variação 100% selecionada)
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
    cy.get('.woocommerce-message, .added_to_cart, [class*="cart-notice"]', { timeout: 20000 })
      .should('exist')
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