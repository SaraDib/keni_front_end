const { test: base, expect } = require('@playwright/test');

const credentials = () => {
  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;
  if (!email || !password) {
    throw new Error('Set E2E_EMAIL and E2E_PASSWORD to an admin account before running the e2e tests.');
  }
  return { email, password };
};

// Unique, recognisable label for data created by a test.
const uid = (prefix) => `${prefix} e2e ${Date.now().toString(36)}`;

// Every admin test fails if the page throws, if the API answers 5xx, or if a
// native browser dialog (alert/confirm) appears — the back-office must use its own UI.
const test = base.extend({
  guard: [async ({ page }, use) => {
    const problems = [];
    page.on('pageerror', (err) => problems.push(`page error: ${err.message}`));
    page.on('response', (res) => {
      if (res.url().includes('/api/') && (res.status() >= 500 || res.status() === 429)) {
        problems.push(`API ${res.status()} on ${res.request().method()} ${res.url()}`);
      }
    });
    page.on('dialog', async (dialog) => {
      problems.push(`native ${dialog.type()} dialog: "${dialog.message()}"`);
      await dialog.dismiss();
    });
    await use(problems);
    expect(problems, 'unexpected errors during the test').toEqual([]);
  }, { auto: true }],
});

// Opens an admin page and waits for its main heading.
// The local API (`php artisan serve`) answers one request at a time, so loading
// can be slow while the dev server recompiles; allow it more time than usual.
const LOADING_TIMEOUT = 30_000;

const openAdminPage = async (page, path, heading) => {
  await page.goto(`/admin/${path}`);
  await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible({ timeout: LOADING_TIMEOUT });
  await expect(page.getByText(/^Chargement/)).toHaveCount(0, { timeout: LOADING_TIMEOUT });
};

// Clicks a row's delete action, cancels once, then confirms in the shared dialog.
const deleteRowWithConfirm = async (page, row, confirmLabel = 'Supprimer') => {
  await row.getByRole('button', { name: 'Supprimer' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('Confirmer la suppression');
  await dialog.getByRole('button', { name: 'Annuler' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(row).toBeVisible();

  await row.getByRole('button', { name: 'Supprimer' }).click();
  // The row may vanish while the page shows its loading state, so wait for the
  // DELETE itself to succeed and for loading to end before checking the list.
  const deleted = page.waitForResponse((res) => res.request().method() === 'DELETE' && res.url().includes('/api/'));
  await page.getByRole('dialog').getByRole('button', { name: confirmLabel, exact: true }).click();
  expect((await deleted).ok(), 'DELETE request should succeed').toBe(true);
  await expect(page.getByText(/^Chargement/)).toHaveCount(0, { timeout: LOADING_TIMEOUT });
  await expect(row).toHaveCount(0);
};

// Types into a ReactQuill editor that follows the given field label.
const fillQuill = async (page, label, text) => {
  const field = page.locator('div', { has: page.locator(`label:text-is("${label}")`) }).last();
  await field.locator('.ql-editor').click();
  await page.keyboard.type(text);
};

module.exports = { test, expect, credentials, uid, openAdminPage, deleteRowWithConfirm, fillQuill };
