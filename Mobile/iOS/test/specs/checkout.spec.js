'use strict';

const path = require('path');
const loginPage = require(path.join(__dirname, '../pageobjects/login.page'));
const homePage = require(path.join(__dirname, '../pageobjects/home.page'));
const productPage = require(path.join(__dirname, '../pageobjects/product.page'));
const cartPage = require(path.join(__dirname, '../pageobjects/cart.page'));

describe('EBAC Store - iOS Checkout E2E', () => {

  it('deve completar o fluxo de compra do login ao order success', async () => {
    // Step 1: Login
    await loginPage.login('cliente@ebac.art.br', 'client01');

    // Step 2: Navegar para Browse
    await homePage.navigateToBrowse();

    // Step 3: Selecionar primeiro produto
    await productPage.selectFirstProduct();

    // Step 4: Adicionar ao carrinho
    await productPage.addToCart();

    // Step 5: Adicionar endereço se necessário
    await cartPage.addAddressIfNeeded();

    // Steps 6-8: Ir para pagamento e finalizar
    await cartPage.proceedToPayment();
    await cartPage.completeCheckout();

    // Step 9: Validar sucesso
    expect(await cartPage.isOrderSuccessful()).toBe(true);
  });

});
