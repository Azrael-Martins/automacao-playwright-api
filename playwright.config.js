// @ts-check

const { defineConfig } = require('@playwright/test');
const { API_BASE_URL } = require('./config/environment');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    [
      'html',
      {
        open: 'never',
        outputFolder: 'playwright-report',
      },
    ],
  ],
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'api',
      testMatch: /tests\/api\/.*\.spec\.js/,
      use: {
        baseURL: API_BASE_URL,
      },
    },
  ],
});
