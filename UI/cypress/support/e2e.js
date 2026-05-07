import './commands'
// Ignora erros JS da aplicação (WooCommerce/WordPress)
Cypress.on('uncaught:exception', () => false)