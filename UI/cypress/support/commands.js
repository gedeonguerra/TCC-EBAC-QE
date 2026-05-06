// cypress/support/commands.js
Cypress.Commands.add('loginEbac', (username, password) => {
  cy.visit('/minha-conta/')
  cy.get('[name="username"]').clear().type(username)
  cy.get('[name="password"]').clear().type(password)
  cy.get('[name="login"]').click()
})