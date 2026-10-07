// End-to-end tests for the admin back-office.
// Requires the frontend (npm start) and the Laravel API to be running, and
// E2E_EMAIL / E2E_PASSWORD to be set to an admin account. See e2e/README.md.
const { defineConfig, devices } = require('@playwright/test');

const AUTH_FILE = 'e2e/.auth/admin.json';

module.exports = defineConfig({
  testDir: './e2e',
  // `php artisan serve` handles one request at a time, so tests run serially.
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'e2e/report' }]],
  outputDir: 'e2e/results',
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3001',
    // Uses the locally installed Microsoft Edge; set E2E_CHANNEL=chrome or
    // leave empty after `npx playwright install chromium` to use another browser.
    channel: process.env.E2E_CHANNEL ?? 'msedge',
    locale: 'fr-FR',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.js/ },
    {
      name: 'auth',
      testMatch: /auth\.spec\.js/,
      use: { ...devices['Desktop Chrome'], channel: process.env.E2E_CHANNEL ?? 'msedge' },
    },
    {
      name: 'admin',
      testIgnore: [/auth\.spec\.js/, /auth\.setup\.js/],
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        channel: process.env.E2E_CHANNEL ?? 'msedge',
        storageState: AUTH_FILE,
      },
    },
  ],
});
