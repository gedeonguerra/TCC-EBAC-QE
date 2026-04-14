// tests/login.spec.js
// US-0002 – Login na plataforma
// Técnicas: Partição de equivalência, Valor limite, Caminho feliz e negativo

const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

const VALID_USER = 'user1_ebac';
const VALID_PASS = 'psw!ebac@test';

test.describe('US-0002 – Login na Plataforma', () => {

  // CT-001 – Caminho Feliz: Login com credenciais válidas
  test('CT-001 | Deve realizar login com sucesso com credenciais válidas', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(VALID_USER, VALID_PASS);

    await expect(page).toHaveURL(/minha-conta/);
    await expect(page.locator('.woocommerce-MyAccount-navigation')).toBeVisible();
  });

  // CT-002 – Caminho Negativo: senha incorreta exibe mensagem de erro
  test('CT-002 | Deve exibir mensagem de erro ao inserir senha incorreta', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(VALID_USER, 'senhaErrada123');

    const error = await loginPage.getErrorMessage();
    expect(error).toContain('incorrect');  // "The password you entered ... is incorrect"
  });

  // CT-003 – Caminho Negativo: usuário inexistente
  test('CT-003 | Deve exibir mensagem de erro para usuário não cadastrado', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('usuario_nao_existe_xyz', 'qualquersenha');

    const error = await loginPage.getErrorMessage();
    expect(error.length).toBeGreaterThan(0);
  });

  // CT-004 – Caminho Negativo: campos vazios
  test('CT-004 | Não deve realizar login com campos em branco', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('', '');

    // Deve permanecer na página de login
    await expect(page).toHaveURL(/minha-conta/);
    const isLogged = await loginPage.isLoggedIn();
    expect(isLogged).toBe(false);
  });

  // CT-005 – Caminho Alternativo: link "Esqueceu a senha" visível
  test('CT-005 | Deve exibir link de recuperação de senha', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await expect(loginPage.lostPasswordLink).toBeVisible();
  });

  // CT-006 – Caminho Negativo: e-mail inválido (sem @)
  test('CT-006 | Deve rejeitar e-mail em formato inválido', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('emailsemarroba', 'qualquerSenha');

    const isLogged = await loginPage.isLoggedIn();
    expect(isLogged).toBe(false);
  });
});
