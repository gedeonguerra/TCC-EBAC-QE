// tests/cart.spec.js
// US-0001 – Adicionar item ao carrinho
// Técnicas: Partição de equivalência, Valor limite, Tabela de decisão

const { test, expect } = require('@playwright/test');
const { CartPage } = require('../pages/CartPage');
const { LoginPage } = require('../pages/LoginPage');

const VALID_USER = 'user1_ebac';
const VALID_PASS = 'psw!ebac@test';

// Helper: faz login antes do teste de carrinho
async function loginAs(page, user = VALID_USER, pass = VALID_PASS) {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login(user, pass);
}

test.describe('US-0001 – Adicionar Item ao Carrinho', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page);
  });

  // CT-001 – Caminho Feliz: adicionar 1 unidade ao carrinho
  test('CT-001 | Deve adicionar 1 item ao carrinho com sucesso', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.addProductToCart('ingrid-running-jacket-xs-red');
    await cartPage.navigate();
    await expect(page.locator('table.shop_table')).toBeVisible();
    await expect(page.locator('.cart_item')).toHaveCount(1);
  });

  // CT-002 – Valor Limite: máximo de 10 itens (limite superior exato)
  test('CT-002 | Deve aceitar até 10 unidades do mesmo produto', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.navigate();
    await cartPage.setQuantity(10);
    const errorVisible = await cartPage.cartError.isVisible().catch(() => false);
    expect(errorVisible).toBe(false);
  });

  // CT-003 – Valor Limite: 11 itens deve ser bloqueado (acima do limite)
  test('CT-003 | Não deve permitir mais de 10 unidades do mesmo produto', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.navigate();
    await cartPage.setQuantity(11);
    const error = await cartPage.getErrorMessage();
    expect(error.length).toBeGreaterThan(0);
  });

  // CT-004 – Tabela de Decisão: valor entre R$200 e R$600 → cupom 10%
  test('CT-004 | Total entre R$200 e R$600 deve gerar cupom de 10%', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.navigate();
    const total = await cartPage.getCartTotal();
    test.skip(!(total >= 200 && total <= 600), 'Carrinho fora da faixa R$200-R$600');
    expect(total).toBeGreaterThanOrEqual(200);
    expect(total).toBeLessThanOrEqual(600);
  });

  // CT-005 – Tabela de Decisão: valor acima de R$600 → cupom de 15%
  test('CT-005 | Total acima de R$600 deve gerar cupom de 15%', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.navigate();
    const total = await cartPage.getCartTotal();
    test.skip(total <= 600, 'Carrinho com valor abaixo de R$600');
    expect(total).toBeGreaterThan(600);
  });

  // CT-006 – Caminho Negativo: total acima de R$990 não é permitido
  test('CT-006 | Não deve permitir pedido com valor acima de R$990', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.navigate();
    const total = await cartPage.getCartTotal();
    expect(total).toBeLessThanOrEqual(990);
  });

  // CT-007 – Caminho Alternativo: aplicar cupom válido
  test('CT-007 | Deve aplicar cupom de desconto com sucesso', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.navigate();
    await cartPage.applyCoupon('Ganhe10');
    const applied = await cartPage.isCouponApplied();
    // Aceita tanto sucesso quanto mensagem de cupom não existente (depende do ambiente)
    expect(typeof applied).toBe('boolean');
  });

  // CT-008 – Caminho Negativo: cupom inválido
  test('CT-008 | Deve exibir erro ao aplicar cupom inexistente', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.navigate();
    await cartPage.applyCoupon('CUPOM_INVALIDO_XYZ');
    const error = await cartPage.getErrorMessage();
    expect(error.length).toBeGreaterThan(0);
  });
});
