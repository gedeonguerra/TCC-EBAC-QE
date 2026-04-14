// Performance/login.k6.js
// US-0002 – Teste de Performance: Login na Plataforma
// Configuração: 20 VUs | 2 min | RampUp 20s

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Métricas customizadas
const loginSuccess = new Rate('login_success_rate');
const loginDuration = new Trend('login_duration_ms');

export const options = {
  stages: [
    { duration: '20s', target: 20 },   // RampUp: 0 → 20 VUs em 20 segundos
    { duration: '80s', target: 20 },   // Sustentado: 20 VUs por 80 segundos
    { duration: '20s', target: 0 },    // RampDown: 20 → 0 VUs
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'],  // 95% das requisições abaixo de 3s
    login_success_rate: ['rate>0.95'],  // Taxa de sucesso acima de 95%
    http_req_failed: ['rate<0.05'],     // Taxa de falha abaixo de 5%
  },
};

// Massa de dados: 5 usuários fornecidos pelo professor
const users = [
  { username: 'user1_ebac', password: 'psw!ebac@test' },
  { username: 'user2_ebac', password: 'psw!ebac@test' },
  { username: 'user3_ebac', password: 'psw!ebac@test' },
  { username: 'user4_ebac', password: 'psw!ebac@test' },
  { username: 'user5_ebac', password: 'psw!ebac@test' },
];

const BASE_URL = 'http://lojaebac.ebaconline.art.br';

export default function () {
  // Seleciona usuário baseado no VU ID (round-robin)
  const user = users[(__VU - 1) % users.length];

  const payload = `log=${encodeURIComponent(user.username)}&pwd=${encodeURIComponent(user.password)}&wp-submit=Log+In&redirect_to=%2Fminha-conta%2F&testcookie=1`;

  const params = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': 'wordpress_test_cookie=WP%20Cookie%20check',
    },
    redirects: 5,
  };

  const start = Date.now();
  const res = http.post(`${BASE_URL}/minha-conta/`, payload, params);
  const duration = Date.now() - start;

  loginDuration.add(duration);

  const success = check(res, {
    'status é 200': (r) => r.status === 200,
    'redirecionou para minha conta': (r) => r.url.includes('minha-conta'),
    'não exibe mensagem de erro': (r) => !r.body.includes('woocommerce-error'),
  });

  loginSuccess.add(success ? 1 : 0);

  sleep(1); // Simula comportamento humano entre requisições
}

export function handleSummary(data) {
  return {
    'Performance/reports/login-summary.json': JSON.stringify(data, null, 2),
  };
}
