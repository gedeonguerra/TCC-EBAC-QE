// Page Object Model — LoginPage
// US-0002: Login na plataforma

class LoginPage {
  get usernameField() { return cy.get('#username') }
  get passwordField() { return cy.get('#password') }
  get loginButton()   { return cy.get('[name="login"]') }
  get errorMessage()  { return cy.get('.woocommerce-error') }
  get myAccount()     { return cy.get('.woocommerce-MyAccount-navigation') }

  navigate() {
    cy.visit('/minha-conta/', { failOnStatusCode: false })
    cy.get('body', { timeout: 30000 }).then(($body) => {
      if ($body.find('.woocommerce-MyAccount-navigation').length > 0) {
        cy.visit('/minha-conta/customer-logout/', { failOnStatusCode: false })
        cy.visit('/minha-conta/', { failOnStatusCode: false })
      }
    })
    cy.get('#username', { timeout: 30000 }).should('be.visible')
  }

  fillCredentials(username, password) {
    this.usernameField.clear().type(username, { log: false })
    this.passwordField.clear().type(password, { log: false })
  }

  submit() {
    this.loginButton.click()
  }

  // Usado pelo US001 (beforeEach) — reutiliza sessão entre testes
  loginWithSession(username, password) {
    cy.session([username], () => {
      cy.clearCookies()
      cy.clearLocalStorage()
      cy.visit('/minha-conta/', { failOnStatusCode: false })
      cy.get('#username', { timeout: 30000 }).should('be.visible')
      cy.get('#username').type(username, { log: false })
      cy.get('#password').type(password, { log: false })
      cy.get('[name="login"]').click()
      cy.get('.woocommerce-MyAccount-navigation', { timeout: 20000 })
        .should('be.visible')
    }, { cacheAcrossSpecs: false })
    cy.visit('/minha-conta/', { failOnStatusCode: false })
  }

  // Usado pelo US002 — login direto sem cache de sessão
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