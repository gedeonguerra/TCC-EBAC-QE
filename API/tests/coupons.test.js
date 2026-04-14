// tests/coupons.test.js
// US-0003 – API de Cupons (EBAC Shop WooCommerce REST API)
// Ferramentas: Supertest + Jest | Contract Testing incluído

const request = require('supertest');

const BASE_URL = 'http://lojaebac.ebaconline.art.br';
const AUTH = 'Basic YWRtaW5fZWJhYzpAYWRtaW4hJmJAYyEyMDIy';

// Código único para evitar conflitos entre execuções
const COUPON_CODE = `TESTE_AUTO_${Date.now()}`;

let createdCouponId = null;

// ─── Contrato esperado de um cupom ───────────────────────────────────────────
function validateCouponContract(coupon) {
  expect(typeof coupon.id).toBe('number');
  expect(typeof coupon.code).toBe('string');
  expect(typeof coupon.amount).toBe('string');
  expect(typeof coupon.discount_type).toBe('string');
  expect(typeof coupon.description).toBe('string');
  expect(coupon.code.length).toBeGreaterThan(0);
}

// ─── POST – Cadastrar Cupom ───────────────────────────────────────────────────
describe('US-0003 | POST /wc/v3/coupons – Cadastrar Cupom', () => {

  // CT-001 – Caminho Feliz: criar cupom com todos os campos obrigatórios
  test('CT-001 | Deve cadastrar um cupom com sucesso (201)', async () => {
    const res = await request(BASE_URL)
      .post('/wp-json/wc/v3/coupons')
      .set('Authorization', AUTH)
      .send({
        code: COUPON_CODE,
        amount: '10.00',
        discount_type: 'fixed_product',
        description: 'Cupom de teste automatizado'
      });

    expect(res.status).toBe(201);
    validateCouponContract(res.body);
    expect(res.body.code).toBe(COUPON_CODE.toLowerCase());
    expect(res.body.amount).toBe('10.00');
    expect(res.body.discount_type).toBe('fixed_product');
    createdCouponId = res.body.id;
  });

  // CT-002 – Caminho Negativo: código de cupom duplicado deve retornar erro
  test('CT-002 | Não deve cadastrar cupom com código duplicado (400)', async () => {
    // Usa o mesmo código já criado no CT-001
    const res = await request(BASE_URL)
      .post('/wp-json/wc/v3/coupons')
      .set('Authorization', AUTH)
      .send({
        code: COUPON_CODE,
        amount: '10.00',
        discount_type: 'fixed_product',
        description: 'Cupom duplicado'
      });

    expect([400, 409]).toContain(res.status);
    expect(res.body).toHaveProperty('code');  // código de erro WooCommerce
  });

  // CT-003 – Caminho Negativo: requisição sem autenticação deve retornar 401
  test('CT-003 | Deve retornar 401 para requisição sem autenticação', async () => {
    const res = await request(BASE_URL)
      .post('/wp-json/wc/v3/coupons')
      .send({
        code: 'SEM_AUTH',
        amount: '10.00',
        discount_type: 'fixed_product',
        description: 'Sem auth'
      });

    expect([401, 403]).toContain(res.status);
  });

  // CT-004 – Caminho Negativo: body vazio deve retornar erro de validação
  test('CT-004 | Deve retornar erro ao enviar body sem campos obrigatórios', async () => {
    const res = await request(BASE_URL)
      .post('/wp-json/wc/v3/coupons')
      .set('Authorization', AUTH)
      .send({});

    expect([400, 422]).toContain(res.status);
  });
});

// ─── GET – Listar Cupons ──────────────────────────────────────────────────────
describe('US-0003 | GET /wc/v3/coupons – Listar Cupons', () => {

  // CT-005 – Caminho Feliz: listar todos os cupons
  test('CT-005 | Deve listar todos os cupons cadastrados (200)', async () => {
    const res = await request(BASE_URL)
      .get('/wp-json/wc/v3/coupons')
      .set('Authorization', AUTH);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    // Valida contrato do primeiro item
    validateCouponContract(res.body[0]);
  });

  // CT-006 – Caminho Feliz: buscar cupom por ID
  test('CT-006 | Deve retornar um cupom específico pelo ID (200)', async () => {
    // Usa o cupom criado no CT-001
    if (!createdCouponId) {
      return; // Depende do CT-001
    }

    const res = await request(BASE_URL)
      .get(`/wp-json/wc/v3/coupons/${createdCouponId}`)
      .set('Authorization', AUTH);

    expect(res.status).toBe(200);
    validateCouponContract(res.body);
    expect(res.body.id).toBe(createdCouponId);
  });

  // CT-007 – Caminho Negativo: ID inexistente deve retornar 404
  test('CT-007 | Deve retornar 404 para ID de cupom inexistente', async () => {
    const res = await request(BASE_URL)
      .get('/wp-json/wc/v3/coupons/9999999')
      .set('Authorization', AUTH);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
  });

  // CT-008 – Caminho Negativo: GET sem autenticação deve retornar 401
  test('CT-008 | Deve retornar 401 ao listar cupons sem autenticação', async () => {
    const res = await request(BASE_URL)
      .get('/wp-json/wc/v3/coupons');

    expect([401, 403]).toContain(res.status);
  });

  // CT-009 – Contrato: campo "amount" deve ser string numérica
  test('CT-009 | O campo amount deve ser uma string numérica válida', async () => {
    const res = await request(BASE_URL)
      .get('/wp-json/wc/v3/coupons')
      .set('Authorization', AUTH);

    expect(res.status).toBe(200);
    res.body.forEach(coupon => {
      expect(isNaN(parseFloat(coupon.amount))).toBe(false);
    });
  });
});
