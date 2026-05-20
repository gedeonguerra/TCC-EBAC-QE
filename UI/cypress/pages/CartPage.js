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
    cy.url({ timeout: 30000 }).should('include', slug)
    cy.get('.single_add_to_cart_button', { timeout: 30000 }).should('exist')
  }

  selectVariation(size = 'L', color = 'Black') {
    // Clica no swatch visível (atualiza estado visual do plugin)
    cy.get(`[title='${size}']`, { timeout: 10000 }).first().click({ force: true })

    // Força o <select> oculto + dispara o evento que o WooCommerce escuta
    cy.get('select[name="attribute_pa_size"]', { timeout: 5000 }).then($sel => {
      const opt = [...$sel[0].options].find(o =>
        o.text.toLowerCase() === size.toLowerCase() ||
        o.value.toLowerCase() === size.toLowerCase()
      )
      if (opt) cy.wrap($sel).invoke('val', opt.value).trigger('change', { force: true })
    })

    cy.wait(500)

    cy.get(`[title='${color}']`, { timeout: 10000 }).first().click({ force: true })

    cy.get('select[name="attribute_pa_color"]', { timeout: 5000 }).then($sel => {
      const opt = [...$sel[0].options].find(o =>
        o.text.toLowerCase() === color.toLowerCase() ||
        o.value.toLowerCase() === color.toLowerCase()
      )
      if (opt) cy.wrap($sel).invoke('val', opt.value).trigger('change', { force: true })
    })

    cy.wait(500)

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

  goToCheckout() {
    this.checkoutButton.should('be.visible').click()
  }

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