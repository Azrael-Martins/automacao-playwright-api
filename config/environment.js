// Único ponto que carrega o .env — importado antes dos testes via playwright.config.js
require('dotenv').config();

const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY = process.env.API_KEY || '';
const API_TIMEOUT_MS = Number(process.env.API_TIMEOUT_MS || 30_000);

if (!API_BASE_URL) {
  throw new Error(
    'API_BASE_URL deve estar definida no arquivo .env (veja README.md)',
  );
}

module.exports = {
  // Sem barra no final; playwright.config adiciona "/" ao montar baseURL
  apiBaseUrl: API_BASE_URL.replace(/\/$/, ''),
  apiKey: API_KEY,
  apiTimeoutMs: API_TIMEOUT_MS,
};
