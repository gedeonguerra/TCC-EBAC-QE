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
    // O plugin oculta o <select> nativo com display:none e sincroniza via JS.
    // A forma correta é setar o valor no <select> oculto e disparar o evento
    // 'change' que o WooCommerce escuta para atualizar o botão de compra.

    cy.get('select[name="attribute_pa_size"]').then(($sel) => {
      // Encontra o valor (slug) correspondente ao texto do tamanho
      const option = [...$sel[0].options].find(o =>
        o.text.toLowerCase() === size.toLowerCase() ||
        o.value.toLowerCase() === size.toLowerCase()
      )
      if (option) {
        cy.wrap($sel).invoke('val', option.value).trigger('change', { force: true })
      }
    })

    cy.wait(500)

    cy.get('select[name="attribute_pa_color"]').then(($sel) => {
      const option = [...$sel[0].options].find(o =>
        o.text.toLowerCase() === color.toLowerCase() ||
        o.value.toLowerCase() === color.toLowerCase()
      )
      if (option) {
        cy.wrap($sel).invoke('val', option.value).trigger('change', { force: true })
      }
    })

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