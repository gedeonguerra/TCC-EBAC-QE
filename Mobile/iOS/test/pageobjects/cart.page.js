'use strict';

class CartPage {
  get addNewAddressButton() {
    return $('~Add New Address');
  }

  get nameField() {
    return $('//XCUIElementTypeTextField[@placeholder="Enter your name"]');
  }

  get mobileField() {
    return $('//XCUIElementTypeTextField[@placeholder="Enter your mobile number"]');
  }

  get addressField() {
    return $('//XCUIElementTypeTextField[@placeholder="Enter your address"]');
  }

  get cityField() {
    return $('//XCUIElementTypeTextField[@placeholder="City"]');
  }

  get stateField() {
    return $('//XCUIElementTypeTextField[@placeholder="State"]');
  }

  get zipField() {
    return $('//XCUIElementTypeTextField[@placeholder="ZipCode"]');
  }

  get saveButton() {
    return $('~Save');
  }

  get continueToPaymentButton() {
    return $('~Continue to payment');
  }

  get selectAddressButton() {
    return $('~Select address');
  }

  get cashOnDeliveryOption() {
    return $('//XCUIElementTypeStaticText[@name="Cash on Delivery"]');
  }

  get checkoutButton() {
    return $('~Checkout');
  }

  get orderSuccessText() {
    return $('//XCUIElementTypeStaticText[@name="Transaction successful!"]');
  }

  async addAddressIfNeeded() {
    let needsAddress = false;
    try {
      await this.addNewAddressButton.waitForExist({ timeout: 5000 });
      needsAddress = await this.addNewAddressButton.isDisplayed();
    } catch (e) {
      needsAddress = false;
    }

    if (needsAddress) {
      await this.addNewAddressButton.click();
      await this.nameField.waitForDisplayed({ timeout: 10000 });
      await this.nameField.setValue('Test User');
      await this.mobileField.setValue('11999999999');
      await this.addressField.setValue('Rua de Teste 123');
      await this.cityField.setValue('Sao Paulo');
      await this.stateField.setValue('SP');
      await this.zipField.setValue('01310100');
      await this.saveButton.click();
      await $('//XCUIElementTypeStaticText[@name="My Cart"]').waitForDisplayed({ timeout: 15000 });
    }
  }

  async proceedToPayment() {
    try {
      await this.continueToPaymentButton.waitForDisplayed({ timeout: 5000 });
      await this.continueToPaymentButton.click();
    } catch (e) {
      await this.selectAddressButton.click();
    }
    await this.cashOnDeliveryOption.waitForDisplayed({ timeout: 15000 });
  }

  async completeCheckout() {
    await this.checkoutButton.waitForDisplayed({ timeout: 10000 });
    await this.checkoutButton.click();
    await this.orderSuccessText.waitForDisplayed({ timeout: 20000 });
  }

  async isOrderSuccessful() {
    return await this.orderSuccessText.isDisplayed();
  }
}

module.exports = new CartPage();
