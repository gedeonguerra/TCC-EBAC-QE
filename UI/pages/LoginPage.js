// pages/LoginPage.js
// Page Object Model para a página de Login

class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput   = page.locator('#username');
    this.passwordInput   = page.locator('#password');
    this.loginButton     = page.locator('button[name="login"]');
    this.errorMessage    = page.locator('.woocommerce-error');
    this.logoutLink      = page.locator('a.logout');
    this.accountTitle    = page.locator('.woocommerce-MyAccount-content');
    this.lostPasswordLink = page.locator('a[href*="lost-password"]');
  }

  async navigate() {
    await this.page.goto('/minha-conta/');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 8000 });
    return this.errorMessage.innerText();
  }

  async isLoggedIn() {
    return await this.logoutLink.isVisible().catch(() => false);
  }
}

module.exports = { LoginPage };
