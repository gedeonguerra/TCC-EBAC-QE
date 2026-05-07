// Page Object Model — LoginPage
// US-0002: Login na plataforma

class LoginPage {
  get usernameField() { return cy.get('#username') }
  get passwordField() { return cy.get('#password') }
  get loginButton() { return cy.get('[name="login"]') }
  get errorMessage() { return cy.get('.woocommerce-error') }
  get myAccount() { return cy.get('.woocommerce-MyAccount-navigation') }

  navigate() {
    cy.visit('/minha-conta/')
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
    this.myAccount.should('be.visible')
  }
}

module.exports = new LoginPage()