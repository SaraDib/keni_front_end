const { test, expect, openAdminPage } = require('./helpers');

test.describe('Paramètres', () => {
  test('modifier le nom de l\'entreprise est conservé après rechargement', async ({ page }) => {
    await openAdminPage(page, 'settings', 'Paramètres');
    const name = page.getByLabel("Nom de l'entreprise");
    await expect(name).not.toHaveValue('');
    const original = await name.inputValue();
    const changed = `${original} e2e`;

    try {
      await name.fill(changed);
      await page.getByRole('button', { name: 'Sauvegarder' }).click();
      await expect(page.getByRole('alert').filter({ hasText: /succès/i })).toBeVisible();

      await page.reload();
      await expect(page.getByLabel("Nom de l'entreprise")).toHaveValue(changed);
    } finally {
      // Restore the original name whatever happened above.
      await page.getByLabel("Nom de l'entreprise").fill(original);
      await page.getByRole('button', { name: 'Sauvegarder' }).click();
      await expect(page.getByRole('alert').filter({ hasText: /succès/i })).toBeVisible();
    }
  });

  test('les onglets de paramètres s\'affichent', async ({ page }) => {
    await openAdminPage(page, 'settings', 'Paramètres');
    for (const tab of ['Contact', 'Réseaux sociaux', 'Avantages sociaux', 'Général']) {
      await page.getByRole('button', { name: tab, exact: true }).click();
    }
    await expect(page.getByLabel("Nom de l'entreprise")).toBeVisible();
  });
});

test.describe('Utilisateurs', () => {
  test('le compte connecté apparaît dans la liste', async ({ page }) => {
    await openAdminPage(page, 'users', 'Utilisateurs');
    const email = process.env.E2E_EMAIL;
    await expect(page.getByRole('row', { name: new RegExp(email.replace(/[.]/g, '\\.')) })).toBeVisible();
  });
});
