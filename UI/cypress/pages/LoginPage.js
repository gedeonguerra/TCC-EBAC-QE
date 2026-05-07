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
    cy.get('#username', { timeout: 20000 }).should('be.visible')
  }

  fillCredentials(username, password) {
    this.usernameField.clear().type(username)
    this.passwordField.clear().type(password)
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
    // Aguarda redirect pós-login — URL muda para /minha-conta/
    cy.url({ timeout: 20000 }).should('include', 'minha-conta')
    // Depois valida o menu de navegação
    this.myAccount.should('be.visible')
  }
}

module.exports = new LoginPage()