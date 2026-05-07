// Page Object Model — LoginPage
// US-0002: Login na plataforma

class LoginPage {
  get usernameField() { return cy.get('#username') }
  get passwordField() { return cy.get('#password') }
  get loginButton()   { return cy.get('[name="login"]') }
  get errorMessage()  { return cy.get('.woocommerce-error') }
  get myAccount()     { return cy.get('.woocommerce-MyAccount-navigation') }

  navigate() {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.visit('/minha-conta/', { failOnStatusCode: false })
    // Se já estiver logado, faz logout primeiro
    cy.get('body', { timeout: 10000 }).then(($body) => {
      if ($body.find('.woocommerce-MyAccount-navigation').length > 0) {
        cy.visit('/minha-conta/customer-logout/', { failOnStatusCode: false })
        cy.visit('/minha-conta/', { failOnStatusCode: false })
      }
    })
    cy.get('#username', { timeout: 20000 }).should('be.visible')
  }

  fillCredentials(username, password) {
    this.usernameField.clear().type(username, { log: false })
    this.passwordField.clear().type(password, { log: false })
  }

  submit() {
    this.loginButton.click()
  }

  login(username, password) {
    this.navigate()
    this.fillCredentials(username, password)
    this.submit()
  }

  shouldShowError(msg) {
    this.errorMessage.should('be.visible').and('contain', msg)
  }

  shouldBeLoggedIn() {
    cy.url({ timeout: 20000 }).should('include', 'minha-conta')
    this.myAccount.should('be.visible')
  }
}

module.exports = new LoginPage()