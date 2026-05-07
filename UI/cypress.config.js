const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://lojaebac.ebaconline.art.br',
    defaultCommandTimeout: 20000,
    pageLoadTimeout: 60000,
    retries: { runMode: 2, openMode: 0 },
    setupNodeEvents(on, config) {}
  },
  env: {
    USUARIO_VALIDO: '',
    SENHA_VALIDA:   '',
    PRODUTO_SLUG:   'teton-pullover-hoodie'
  }
})