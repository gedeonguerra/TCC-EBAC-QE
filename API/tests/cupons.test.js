// US-0003: API de Cupons
// Ferramenta: Supertest + Jest (requisito obrigatório do TCC)
// Técnicas: Partição de Equivalência | Tabela de Decisão | Validação de Contrato

const request = require('supertest')
const Joi     = require('joi')

const BASE_URL = process.env.BASE_URL || 'http://lojaebac.ebaconline.art.br'
const AUTH     = process.env.AUTH_HEADER || 'Basic YWRtaW5fZWJhYzpAYWRtaW4hJmJAYyEyMDIy'

// ─── Schema de Contrato ───────────────────────────────────
const couponSchema = Joi.object({
  id:            Joi.number().integer().required(),
  code:          Joi.string().required(),
  amount:        Joi.string().required(),
  discount_type: Joi.string().required(),
  description:   Joi.string().allow('').required(),
  date_created:  Joi.string().required(),
  date_modified: Joi.string().required(),
  usage_count:   Joi.number().required()
}).unknown(true)

// ─── Helper ──────────────────────────────────────────────
const api = () => request(BASE_URL)
const uniqueCode = () => 'TCCTEST' + Date.now()

describe('US-0003: API de Cupons — Supertest', () => {

  // ════════════════════════════════
  //  GET /wc/v3/coupons
  // ════════════════════════════════

  // CT-003-01 | Caminho Feliz | Partição de Equivalência
  test('CT-003-01: GET /coupons deve retornar 200 e array de cupons', async () => {
    const res = await api()
      .get('/wp-json/wc/v3/coupons')
      .set('Authorization', AUTH)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  // CT-003-02 | GET por ID | Partição de Equivalência
  test('CT-003-02: GET /coupons/{id} deve retornar 200 e cupom correto', async () => {
    // Cria cupom primeiro
    const code = uniqueCode()
    const criacao = await api()
      .post('/wp-json/wc/v3/coupons')
      .set('Authorization', AUTH)
      .send({ code, amount: '10', discount_type: 'fixed_product', description: 'Teste get por id' })

    const id = criacao.body.id

    const res = await api()
      .get(`/wp-json/wc/v3/coupons/${id}`)
      .set('Authorization', AUTH)

    expect(res.status).toBe(200)
    expect(res.body.id).toBe(id)
    expect(res.body.code).toBe(code.toLowerCase())

    // Validação de Contrato
    const { error } = couponSchema.validate(res.body)
    expect(error).toBeUndefined()
  })

  // ════════════════════════════════
  //  POST /wc/v3/coupons
  // ════════════════════════════════

  // CT-003-03 | Caminho Feliz | Partição de Equivalência
  test('CT-003-03: POST /coupons deve criar cupom e retornar 201', async () => {
    const code = uniqueCode()

    const res = await api()
      .post('/wp-json/wc/v3/coupons')
      .set('Authorization', AUTH)
      .send({
        code,
        amount:        '10.00',
        discount_type: 'fixed_product',
        description:   'Cupom de teste TCC'
      })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.code).toBe(code.toLowerCase())
    expect(res.body.amount).toBe('10.00')
    expect(res.body.discount_type).toBe('fixed_product')

    // Validação de Contrato
    const { error } = couponSchema.validate(res.body)
    expect(error).toBeUndefined()
  })

  // CT-003-04 | Negativo | Tabela de Decisão (code duplicado)
  test('CT-003-04: POST com código duplicado deve retornar 400', async () => {
    const code = uniqueCode()

    // Cria o primeiro
    await api()
      .post('/wp-json/wc/v3/coupons')
      .set('Authorization', AUTH)
      .send({ code, amount: '10', discount_type: 'fixed_product', description: 'Primeiro' })

    // Tenta criar com mesmo código
    const res = await api()
      .post('/wp-json/wc/v3/coupons')
      .set('Authorization', AUTH)
      .send({ code, amount: '20', discount_type: 'fixed_product', description: 'Duplicado' })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('O código de cupom já existe')
  })

  // CT-003-05 | Negativo | Partição de Equivalência (campo obrigatório ausente)
  test('CT-003-05: POST sem campo "code" deve retornar 400', async () => {
    const res = await api()
      .post('/wp-json/wc/v3/coupons')
      .set('Authorization', AUTH)
      .send({ amount: '10', discount_type: 'fixed_product', description: 'Sem code' })

    expect(res.status).toBe(400)
  })

  // CT-003-06 | Negativo | Tabela de Decisão (sem autenticação)
  test('CT-003-06: GET sem autenticação deve retornar 401', async () => {
    const res = await api()
      .get('/wp-json/wc/v3/coupons')

    expect(res.status).toBe(401)
  })
})
