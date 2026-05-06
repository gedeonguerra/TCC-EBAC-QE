// Comandos customizados Cypress

Cypress.Commands.add('loginEbac', (username, password) => {
  cy.get('.icon-user-unfollow').click()
  cy.get('[name="username"]').clear().type(username)
  cy.get('.woocommerce-form > :nth-child(2) > [name="password"]').clear().type(password)
  cy.get('[name="login"]').click()
})
