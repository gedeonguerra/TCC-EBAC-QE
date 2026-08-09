'use strict';

class LoginPage {
  get emailField() {
    return $('//XCUIElementTypeTextField');
  }

  get passwordField() {
    return $('//XCUIElementTypeSecureTextField');
  }

  get loginButton() {
    return $('~Login');
  }

  async login(email, password) {
    await browser.pause(8000);
    await this.emailField.waitForExist({ timeout: 30000 });
    await this.emailField.click();
    await this.emailField.clearValue();
    await this.emailField.setValue(email);
    await this.passwordField.click();
    await this.passwordField.clearValue();
    await this.passwordField.setValue(password);
    await this.loginButton.click();
    await this.emailField.waitForDisplayed({ timeout: 30000, reverse: true });
  }

  async isLoginScreenVisible() {
    return await this.loginButton.isDisplayed();
  }
}

module.exports = new LoginPage();
