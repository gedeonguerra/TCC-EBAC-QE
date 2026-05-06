// Performance - K6
// US-0002: Login | US-0003: API Cupons
// Config: 20 VUs | 120s execução | 20s rampUp | p(95) < 2000ms

import http  from 'k6/http'
import { check, sleep, group } from 'k6'
import { Rate, Trend } from 'k6/metrics'

// ─── Métricas customizadas ────────────────────────────────
const loginFailRate   = new Rate('login_fail_rate')
const cupomFailRate   = new Rate('cupom_fail_rate')
const loginDuration   = new Trend('login_duration')
const cupomDuration   = new Trend('cupom_duration')

// ─── Configuração ─────────────────────────────────────────
export const options = {
  stages: [
    { duration: '20s', target: 20 },  // rampUp
    { duration: '80s', target: 20 },  // sustentação
    { duration: '20s', target: 0  },  // rampDown
  ],
  thresholds: {
    http_req_duration:  ['p(95)<2000'],
    http_req_failed:    ['rate<0.01'],
    login_fail_rate:    ['rate<0.05'],
    cupom_fail_rate:    ['rate<0.05'],
  },
}

// ─── Massa de dados ───────────────────────────────────────
const BASE_URL = 'http://lojaebac.ebaconline.art.br'
const AUTH     = 'Basic YWRtaW5fZWJhYzpAYWRtaW4hJmJAYyEyMDIy'

const USERS = [
  { username: 'user1_ebac', password: 'psw!ebac@test' },
  { username: 'user2_ebac', password: 'psw!ebac@test' },
  { username: 'user3_ebac', password: 'psw!ebac@test' },
  { username: 'user4_ebac', password: 'psw!ebac@test' },
  { username: 'user5_ebac', password: 'psw!ebac@test' },
]

// ─── Teste Principal ──────────────────────────────────────
export default function () {
  const user = USERS[__VU % USERS.length]

  // ── CT-002-01: Login (US-0002) ────────────────────────
  group('US-0002: Login', () => {
    const loginPayload = `log=${encodeURIComponent(user.username)}&pwd=${encodeURIComponent(user.password)}&wp-submit=Log+In&redirect_to=%2Fwp-admin%2F&testcookie=1`

    const loginRes = http.post(
      `${BASE_URL}/wp-login.php`,
      loginPayload,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )

    loginDuration.add(loginRes.timings.duration)

    const loginOk = check(loginRes, {
      'login: status 200 ou 302': (r) => r.status === 200 || r.status === 302,
    })
    loginFailRate.add(!loginOk)
  })

  sleep(1)

  // ── CT-003-01: GET Cupons (US-0003) ───────────────────
  group('US-0003: GET Cupons', () => {
    const cupomRes = http.get(
      `${BASE_URL}/wp-json/wc/v3/coupons`,
      { headers: { Authorization: AUTH } }
    )

    cupomDuration.add(cupomRes.timings.duration)

    const cupomOk = check(cupomRes, {
      'cupons: status 200':       (r) => r.status === 200,
      'cupons: body é array':     (r) => Array.isArray(JSON.parse(r.body)),
      'cupons: resposta < 2000ms':(r) => r.timings.duration < 2000,
    })
    cupomFailRate.add(!cupomOk)
  })

  sleep(1)
}
