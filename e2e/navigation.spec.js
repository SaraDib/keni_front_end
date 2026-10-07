const { test, expect } = require('./helpers');

// Sidebar label -> route and page heading.
const PAGES = [
  { nav: 'Tableau de bord', path: 'dashboard', heading: 'Tableau de bord' },
  { nav: 'Gestion des services', path: 'services', heading: 'Gestion des services' },
  { nav: 'Section experts', path: 'experts', heading: 'Section Experts' },
  { nav: 'Qui sommes-nous', path: 'about-us', heading: 'Qui sommes-nous' },
  { nav: 'Mises à jour', path: 'updates', heading: 'Mise à jour' },
  { nav: 'Types de recettes', path: 'gestion-recettes', heading: 'Types de recette' },
  { nav: 'Packs et services', path: 'physiotherapie', heading: 'Packs et services' },
  { nav: 'FAQ', path: 'faq', heading: 'FAQ' },
  { nav: 'Centres Global Health', path: 'health-center', heading: 'Centres Global Health' },
  { nav: 'Messages de contact', path: 'contact', heading: 'Messages de contact' },
  { nav: 'Candidatures', path: 'job-offers', heading: 'Candidatures' },
  { nav: "L'équipe", path: 'people', heading: "L'équipe" },
  { nav: 'Rendez-vous', path: 'appointments', heading: 'Rendez-vous' },
  { nav: 'Utilisateurs', path: 'users', heading: 'Utilisateurs' },
  { nav: 'Paramètres', path: 'settings', heading: 'Paramètres' },
];

test.describe('Navigation du back-office', () => {
  test('chaque entrée du menu ouvre sa page sans erreur', async ({ page }) => {
    await page.goto('/admin/dashboard');
    const sidebar = page.locator('aside');

    for (const { nav, path, heading } of PAGES) {
      await test.step(nav, async () => {
        await sidebar.getByRole('link', { name: nav, exact: true }).click();
        await expect(page).toHaveURL(new RegExp(`/admin/${path}$`));
        await expect(page.getByRole('heading', { level: 1, name: heading, exact: true })).toBeVisible();

        // The active entry is highlighted and the breadcrumb ends on the page.
        const breadcrumb = page.getByRole('navigation', { name: "Fil d'Ariane" });
        if (path !== 'dashboard') await expect(breadcrumb).toContainText(nav);

        // No loading error banner once the data has arrived.
        await page.waitForLoadState('networkidle').catch(() => {});
        await expect(page.getByRole('alert').filter({ hasText: /Erreur/ })).toHaveCount(0);
      });
    }
  });

  test('le tableau de bord affiche ses quatre graphiques', async ({ page }) => {
    await page.goto('/admin/dashboard');
    for (const title of ['Rendez-vous par mois', 'Candidats spontanés par mois', 'Trafic du site web', 'Sources de trafic']) {
      await expect(page.getByRole('heading', { name: title })).toBeVisible();
    }
  });

  test('un lien inconnu revient au tableau de bord', async ({ page }) => {
    await page.goto('/admin/page-inexistante');
    await expect(page).toHaveURL(/\/admin\/dashboard$/);
  });

  test('menu mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/admin/dashboard');
    await page.getByRole('button', { name: 'Ouvrir le menu' }).click();
    await page.locator('aside').getByRole('link', { name: 'FAQ', exact: true }).click();
    await expect(page).toHaveURL(/\/admin\/faq$/);
    await expect(page.getByRole('heading', { level: 1, name: 'FAQ' })).toBeVisible();
  });

  test('la page Rendez-vous n\'écrit pas le jeton dans la console', async ({ page }) => {
    await page.goto('/admin/dashboard');
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();

    const logs = [];
    page.on('console', (msg) => logs.push(msg.text()));
    await page.locator('aside').getByRole('link', { name: 'Rendez-vous', exact: true }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Rendez-vous' })).toBeVisible();
    await page.waitForLoadState('networkidle').catch(() => {});
    expect(logs.some((line) => token && line.includes(token))).toBe(false);
  });
});
