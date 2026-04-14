// pages/CartPage.js
// Page Object Model para a página de Carrinho

class CartPage {
  constructor(page) {
    this.page = page;
    this.quantityInput   = page.locator('input.qty');
    this.updateCartBtn   = page.locator('button[name="update_cart"]');
    this.couponInput     = page.locator('#coupon_code');
    this.applyCouponBtn  = page.locator('button[name="apply_coupon"]');
    this.cartTotal       = page.locator('.order-total .woocommerce-Price-amount');
    this.cartError       = page.locator('.woocommerce-error');
    this.cartNotice      = page.locator('.woocommerce-message');
    this.couponRow       = page.locator('.cart-discount');
    this.removeItemBtn   = page.locator('a.remove');
  }

  async navigate() {
    await this.page.goto('/carrinho/');
  }

  async setQuantity(qty) {
    await this.quantityInput.fill(String(qty));
    await this.updateCartBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getCartTotal() {
    const text = await this.cartTotal.last().innerText();
    // Remove "R$" e converte para número
    return parseFloat(text.replace(/[R$\s.]/g, '').replace(',', '.'));
  }

  async getErrorMessage() {
    await this.cartError.waitFor({ state: 'visible', timeout: 8000 });
    return this.cartError.innerText();
  }

  async applyCoupon(code) {
    await this.couponInput.fill(code);
    await this.applyCouponBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  async isCouponApplied() {
    return this.couponRow.isVisible();
  }

  // Adiciona um produto ao carrinho via URL de produto
  async addProductToCart(productSlug) {
    await this.page.goto(`/loja/${productSlug}/`);
    const addBtn = this.page.locator('.single_add_to_cart_button');
    await addBtn.click();
    await this.page.waitForLoadState('networkidle');
    await this.navigate();
  }
}

module.exports = { CartPage };
