const { test, expect, uid, openAdminPage, deleteRowWithConfirm } = require('./helpers');

const API = process.env.E2E_API_URL || 'http://127.0.0.1:8001/api';

test.describe('Sécurité des comptes', () => {
  test('la création de compte est refusée sans connexion', async ({ playwright }) => {
    const anonymous = await playwright.request.newContext();
    const res = await anonymous.post(`${API}/register`, {
      headers: { Accept: 'application/json' },
      data: {
        ID_Entreprise: 1,
        Nom: 'Intrus',
        Email: `intrus-${Date.now()}@exemple.com`,
        Role: 'admin',
        password: 'motdepasse123',
      },
    });
    expect(res.status()).toBe(401);
    await anonymous.dispose();
  });

  test('un administrateur peut créer puis supprimer un utilisateur', async ({ page }) => {
    const name = uid('Utilisateur');
    const email = `e2e-${Date.now()}@exemple.com`;
    await openAdminPage(page, 'users', 'Utilisateurs');

    await page.getByRole('button', { name: 'Ajouter', exact: true }).click();
    await page.getByLabel('Nom complet').fill(name);
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Rôle').selectOption({ index: 1 });
    await page.getByLabel('Mot de passe').fill('motdepasse-e2e-123');
    await page.getByRole('button', { name: 'Enregistrer' }).click();

    const row = page.getByRole('row', { name: new RegExp(email.replace(/[.]/g, '\\.')) });
    await expect(row).toBeVisible();
    await deleteRowWithConfirm(page, row);
  });
});
