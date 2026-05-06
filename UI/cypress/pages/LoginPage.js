// Page Object Model — LoginPage
// US-0002: Login na plataforma

class LoginPage {
  // ─── Seletores ───────────────────────────────────────────
  get userIcon()     { return cy.get('.icon-user-unfollow') }
  get usernameField(){ return cy.get('[name="username"]') }
  get passwordField(){ return cy.get('.woocommerce-form > :nth-child(2) > [name="password"]') }
  get loginButton()  { return cy.get('[name="login"]') }
  get errorMessage() { return cy.get('.woocommerce-error') }
  get myAccountTitle(){ return cy.get('#main') }

  // ─── Ações ───────────────────────────────────────────────
  navigate() {
    this.userIcon.click()
    cy.get('#tbay-main-content').should('contain', 'Login')
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

  // ─── Asserções ───────────────────────────────────────────
  shouldShowError(mensagem) {
    this.errorMessage.should('be.visible').and('contain', mensagem)
  }

  shouldBeLoggedIn() {
    this.myAccountTitle.should('contain', 'Minha conta')
  }
}

module.exports = new LoginPage()
