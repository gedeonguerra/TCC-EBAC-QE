// Performance/coupons.k6.js
// US-0003 – Teste de Performance: API de Cupons
// Configuração: 20 VUs | 2 min | RampUp 20s

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const getSuccess  = new Rate('get_coupons_success_rate');
const postSuccess = new Rate('post_coupon_success_rate');
const getDuration = new Trend('get_coupons_duration_ms');

export const options = {
  stages: [
    { duration: '20s', target: 20 },
    { duration: '80s', target: 20 },
    { duration: '20s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    get_coupons_success_rate: ['rate>0.95'],
    http_req_failed: ['rate<0.05'],
  },
};

const BASE_URL = 'http://lojaebac.ebaconline.art.br';
const AUTH     = 'Basic YWRtaW5fZWJhYzpAYWRtaW4hJmJAYyEyMDIy';

const headers = {
  'Authorization': AUTH,
  'Content-Type': 'application/json',
};

export default function () {
  // ── GET: Listar cupons ────────────────────────────────────────────────────
  const start = Date.now();
  const getRes = http.get(`${BASE_URL}/wp-json/wc/v3/coupons`, { headers });
  getDuration.add(Date.now() - start);

  const getOk = check(getRes, {
    'GET status 200': (r) => r.status === 200,
    'resposta é array': (r) => {
      try { return Array.isArray(JSON.parse(r.body)); } catch { return false; }
    },
    'tempo de resposta < 2s': (r) => r.timings.duration < 2000,
  });
  getSuccess.add(getOk ? 1 : 0);

  sleep(0.5);

  // ── POST: Criar cupom ─────────────────────────────────────────────────────
  const couponCode = `PERF_${__VU}_${Date.now()}`;
  const body = JSON.stringify({
    code: couponCode,
    amount: '10.00',
    discount_type: 'fixed_product',
    description: `Cupom de performance VU-${__VU}`,
  });

  const postRes = http.post(`${BASE_URL}/wp-json/wc/v3/coupons`, body, { headers });

  const postOk = check(postRes, {
    'POST status 201': (r) => r.status === 201,
    'retornou ID': (r) => {
      try { return JSON.parse(r.body).id > 0; } catch { return false; }
    },
  });
  postSuccess.add(postOk ? 1 : 0);

  sleep(1);
}

export function handleSummary(data) {
  return {
    'Performance/reports/coupons-summary.json': JSON.stringify(data, null, 2),
  };
}
