// Mobile/pages/CatalogPage.js
// Page Object Model – Catálogo de Produtos (Android)

class CatalogPage {
  // ─── Seletores ────────────────────────────────────────────────────────────
  get searchBar()       { return $('~search_bar'); }
  get searchInput()     { return $('android=new UiSelector().resourceId("com.ebacshop:id/searchInput")'); }
  get productList()     { return $$('android=new UiSelector().resourceId("com.ebacshop:id/productCard")'); }
  get categoryFilter()  { return $('android=new UiSelector().resourceId("com.ebacshop:id/categoryFilter")'); }
  get emptyStateText()  { return $('android=new UiSelector().resourceId("com.ebacshop:id/emptyState")'); }
  get firstProduct()    { return $('android=new UiSelector().resourceId("com.ebacshop:id/productCard").instance(0)'); }
  get productTitle()    { return $('android=new UiSelector().resourceId("com.ebacshop:id/productTitle").instance(0)'); }
  get productPrice()    { return $('android=new UiSelector().resourceId("com.ebacshop:id/productPrice").instance(0)'); }
  get addToCartBtn()    { return $('android=new UiSelector().resourceId("com.ebacshop:id/btnAddToCart")'); }

  // ─── Ações ────────────────────────────────────────────────────────────────
  async waitForLoad() {
    await this.productList[0].waitForDisplayed({ timeout: 12000 });
  }

  async search(term) {
    await this.searchBar.click();
    await this.searchInput.setValue(term);
    await driver.hideKeyboard();
    await browser.pause(1000);
  }

  async selectCategory(categoryName) {
    await this.categoryFilter.click();
    const option = await $(`android=new UiSelector().text("${categoryName}")`);
    await option.click();
  }

  async getProductCount() {
    return (await this.productList).length;
  }

  async getFirstProductTitle() {
    return this.productTitle.getText();
  }

  async isEmptyStateVisible() {
    return this.emptyStateText.isDisplayed().catch(() => false);
  }

  async tapFirstProduct() {
    await this.firstProduct.click();
  }
}

module.exports = new CatalogPage();
