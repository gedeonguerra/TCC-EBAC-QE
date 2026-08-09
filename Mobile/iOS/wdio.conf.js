require('dotenv').config();

exports.config = {
  user: process.env.SAUCE_USERNAME,
  key: process.env.SAUCE_ACCESS_KEY,
  region: 'us',

  services: [['sauce', { sauceConnect: false }]],

  capabilities: [{
    platformName: 'iOS',
    'appium:deviceName': 'iPhone Simulator',
    'appium:platformVersion': 'current_major',
    'appium:automationName': 'XCUITest',
    'appium:app': 'storage:filename=LojaEBAC-sim.zip',
    'appium:orientation': 'PORTRAIT',
    'appium:newCommandTimeout': 240,
    'appium:fullReset': true,
    'sauce:options': {
      appiumVersion: '2.0.0',
      name: 'EBAC iOS Checkout Test',
      build: 'EBAC M29 iOS Tests'
    }
  }],

  framework: 'mocha',
  mochaOpts: {
    timeout: 300000
  },

  specs: ['./test/specs/**/*.spec.js'],
  reporters: ['spec']
};
