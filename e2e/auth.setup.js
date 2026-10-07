const { test: setup, expect } = require('@playwright/test');
const { credentials } = require('./helpers');

// Logs in once through the real form and stores the session for the admin tests.
setup('authenticate as admin', async ({ page }) => {
  const { email, password } = credentials();
  await page.goto('/admin/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Mot de passe').fill(password);
  await page.getByRole('button', { name: 'Se Connecter' }).click();
  // The first request after the servers start can be slow (cold cache, compile).
  await expect(page).toHaveURL(/\/admin\/dashboard$/, { timeout: 30_000 });
  await page.context().storageState({ path: 'e2e/.auth/admin.json' });
});
