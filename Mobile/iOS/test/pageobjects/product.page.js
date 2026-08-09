'use strict';

class ProductPage {
  get firstProduct() {
    return $('//XCUIElementTypeCollectionView//XCUIElementTypeCell[1]');
  }

  get addToCartButton() {
    return $('~Add To Cart');
  }

  async selectFirstProduct() {
    await this.firstProduct.waitForDisplayed({ timeout: 15000 });
    await this.firstProduct.click();
    await this.addToCartButton.waitForDisplayed({ timeout: 15000 });
  }

  async addToCart() {
    const visible = await this.addToCartButton.isDisplayed();
    if (!visible) {
      await browser.execute('mobile: scroll', { direction: 'down' });
    }
    await this.addToCartButton.click();
    await $('//XCUIElementTypeStaticText[@name="My Cart"]').waitForDisplayed({ timeout: 15000 });
  }
}

module.exports = new ProductPage();
