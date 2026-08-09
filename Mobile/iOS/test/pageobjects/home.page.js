'use strict';

class HomePage {
  get browseTab() {
    return $('~Browse');
  }

  get browseHeader() {
    return $('//XCUIElementTypeStaticText[@name="Browse"]');
  }

  async navigateToBrowse() {
    await this.browseTab.waitForDisplayed({ timeout: 15000 });
    await this.browseTab.click();
    await this.browseHeader.waitForDisplayed({ timeout: 15000 });
  }

  async isBrowseScreenVisible() {
    return await this.browseHeader.isDisplayed();
  }
}

module.exports = new HomePage();
