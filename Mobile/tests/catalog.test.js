// Mobile/tests/catalog.test.js
// US-0004 – Catálogo de Produtos (Mobile Android)
// Pattern: Page Object Model | Framework: Appium + WebDriverIO

const CatalogPage = require('../pages/CatalogPage');

describe('US-0004 – Catálogo de Produtos (Mobile)', () => {

  // CT-MOB-001 – Caminho Feliz: lista de produtos carrega na tela inicial
  it('CT-MOB-001 | Deve exibir lista de produtos ao abrir o app', async () => {
    await CatalogPage.waitForLoad();
    const count = await CatalogPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  // CT-MOB-002 – Caminho Feliz: buscar produto por nome retorna resultado
  it('CT-MOB-002 | Deve encontrar produto ao buscar por nome válido', async () => {
    await CatalogPage.search('Jacket');
    await browser.pause(1500);
    const count = await CatalogPage.getProductCount();
    expect(count).toBeGreaterThan(0);
    const title = await CatalogPage.getFirstProductTitle();
    expect(title.toLowerCase()).toContain('jacket');
  });

  // CT-MOB-003 – Caminho Feliz: filtro por categoria funciona
  it('CT-MOB-003 | Deve filtrar produtos ao selecionar uma categoria', async () => {
    await CatalogPage.selectCategory('Roupas');
    await browser.pause(1500);
    const count = await CatalogPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  // CT-MOB-004 – Caminho Negativo: busca sem resultados exibe estado vazio
  it('CT-MOB-004 | Deve exibir mensagem de "sem resultados" para busca inexistente', async () => {
    await CatalogPage.search('produtoxyzinexistente99999');
    await browser.pause(1500);
    const empty = await CatalogPage.isEmptyStateVisible();
    expect(empty).toBe(true);
  });

  // CT-MOB-005 – Caminho Feliz: toque em produto abre detalhes
  it('CT-MOB-005 | Deve abrir tela de detalhes ao tocar em um produto', async () => {
    await CatalogPage.waitForLoad();
    await CatalogPage.tapFirstProduct();
    const addBtn = await CatalogPage.addToCartBtn;
    await addBtn.waitForDisplayed({ timeout: 8000 });
    expect(await addBtn.isDisplayed()).toBe(true);
  });
});
