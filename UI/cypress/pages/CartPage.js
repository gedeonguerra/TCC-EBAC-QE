// Page Object Model — CartPage
// US-0001: Adicionar item ao carrinho
//
// Plugin: WooCommerce Variation Swatches
// O <select> fica oculto (display:none). Os botões visuais são <li> com
// classe .button-variable-item-{value} — é neles que o Cypress deve clicar.
//
// Seletores confirmados via DevTools:
//   Tamanho : li.button-variable-item-XS | S | M | L | XL
//   Cor     : li.button-variable-item-Black | Purple | Red
//   Guard   : table.variations (não form.variations_form)

class CartPage {

  // ── Getters ───────────────────────────────────────────────────────────────
  get qtyField()        { return cy.get('input.qty') }
  get addToCartButton() { return cy.get('.single_add_to_cart_button') }
  get cartMessage()     { return cy.get('.woocommerce-message') }
  get viewCartButton()  { return cy.get('.woocommerce-message > .button') }
  get checkoutButton()  { return cy.get('.checkout-button') }
  get orderTotal()      { return cy.get('.order-total > td') }
  get errorNotice()     { return cy.get('.woocommerce-error, [role="alert"]') }

  // ── visitProduct ──────────────────────────────────────────────────────────
  visitProduct(slug) {
    cy.visit(`/product/${slug}/`, { failOnStatusCode: false })
    cy.url({ timeout: 30000 }).should('include', slug)
    cy.get('table.variations', { timeout: 15000 }).should('exist')
    cy.get('.single_add_to_cart_button', { timeout: 30000 }).should('exist')
  }

  // ── selectVariation ───────────────────────────────────────────────────────
  // Clica nos botões <li> visíveis gerados pelo plugin Variation Swatches.
  // O plugin sincroniza o <select> oculto automaticamente após o clique.
  selectVariation(size = 'L', color = 'Black') {

    // Tamanho — ex: li.button-variable-item-L
    cy.get(`li.button-variable-item-${size}`, { timeout: 10000 })
      .should('exist')
      .click({ force: true })

    cy.wait(400)

    // Cor — ex: li.button-variable-item-Black
    cy.get(`li.button-variable-item-${color}`, { timeout: 10000 })
      .should('exist')
      .click({ force: true })

    cy.wait(400)

    // Aguarda o botão "Adicionar ao carrinho" sair do estado disabled
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