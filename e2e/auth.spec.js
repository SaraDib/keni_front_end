const { test, expect, credentials } = require('./helpers');

test.describe('Authentification', () => {
  test('redirige vers la connexion quand on n\'est pas connecté', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/\/admin\/login$/);
    await expect(page.getByRole('heading', { name: 'Bienvenue' })).toBeVisible();
  });

  test('refuse un mauvais mot de passe', async ({ page, guard }) => {
    await page.goto('/admin/login');
    await page.getByLabel('Email').fill(credentials().email);
    await page.getByLabel('Mot de passe').fill('mauvais-mot-de-passe');
    await page.getByRole('button', { name: 'Se Connecter' }).click();
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login$/);
  });

  test('connexion puis déconnexion', async ({ page }) => {
    const { email, password } = credentials();
    await page.goto('/admin/login');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Mot de passe').fill(password);
    await page.getByRole('button', { name: 'Se Connecter' }).click();

    await expect(page).toHaveURL(/\/admin\/dashboard$/, { timeout: 30_000 });
    await expect(page.getByRole('heading', { level: 1, name: 'Tableau de bord' })).toBeVisible({ timeout: 30_000 });

    await page.getByRole('button', { name: 'Déconnexion' }).click();
    await expect(page).toHaveURL(/\/admin\/login$/);
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/\/admin\/login$/);
  });
});
