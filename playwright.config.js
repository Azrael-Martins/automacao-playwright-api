const { defineConfig } = require('@playwright/test');
const { apiBaseUrl, apiTimeoutMs } = require('./config/environment');

module.exports = defineConfig({
  testDir: './tests',
  testMatch: '**/api/**/*.spec.js',
  fullyParallel: true,
  retries: 0,
  timeout: apiTimeoutMs,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    // Barra final obrigatória para paths relativos (ex.: usuarios → .../usuarios)
    baseURL: `${apiBaseUrl}/`,
    extraHTTPHeaders: { Accept: 'application/json' },
    trace: 'on-first-retry',
  },
  projects: [{ name: 'api' }],
});
