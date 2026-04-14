// Mobile/wdio.conf.js
// Configuração do WebDriverIO + Appium para testes Android

exports.config = {
  runner: 'local',
  specs: ['./tests/**/*.test.js'],
  maxInstances: 1,
  capabilities: [{
    platformName: 'Android',
    'appium:deviceName': 'emulator-5554',
    'appium:automationName': 'UiAutomator2',
    'appium:app': `${__dirname}/app/ebac-shop.apk`,
    'appium:appPackage': 'com.ebacshop',
    'appium:appActivity': '.MainActivity',
    'appium:noReset': false,
  }],
  logLevel: 'warn',
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: [['appium', { command: 'appium' }]],
  framework: 'mocha',
  reporters: ['spec', ['allure', { outputDir: 'allure-results' }]],
  mochaOpts: { timeout: 60000 },
};
