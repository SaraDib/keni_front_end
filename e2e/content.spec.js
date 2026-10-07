const path = require('path');
const { test, expect, uid, openAdminPage, deleteRowWithConfirm, fillQuill } = require('./helpers');

const IMAGE = path.join(__dirname, 'fixtures', 'image.png');

test.describe('FAQ', () => {
  test('ajouter, modifier et supprimer une question', async ({ page }) => {
    const question = uid('Question');
    const edited = `${question} (modifiée)`;
    await openAdminPage(page, 'faq', 'FAQ');

    await page.getByRole('button', { name: 'Ajouter' }).click();
    await expect(page.getByRole('heading', { name: 'Ajouter FAQ' })).toBeVisible();
    await page.getByLabel('Question (Français)').fill(question);
    await page.getByLabel('Question (Arabe)').fill('سؤال اختبار');
    await page.getByLabel('Réponse (Français)').fill('Réponse de test.');
    await page.getByLabel('Réponse (Arabe)').fill('جواب اختبار');
    await page.getByRole('button', { name: 'Enregistrer' }).click();

    const row = page.getByRole('row', { name: new RegExp(question) });
    await expect(row).toBeVisible();

    await row.getByRole('button', { name: 'Modifier' }).click();
    await expect(page.getByRole('heading', { name: 'Modifier FAQ' })).toBeVisible();
    await page.getByLabel('Question (Français)').fill(edited);
    await page.getByRole('button', { name: 'Mettre à jour' }).click();

    const editedRow = page.getByRole('row', { name: new RegExp(edited.replace(/[()]/g, '\\$&')) });
    await expect(editedRow).toBeVisible();
    await deleteRowWithConfirm(page, editedRow);
  });

  test('le formulaire exige les champs obligatoires', async ({ page }) => {
    await openAdminPage(page, 'faq', 'FAQ');
    await page.getByRole('button', { name: 'Ajouter' }).click();
    await page.getByRole('button', { name: 'Enregistrer' }).click();
    await expect(page.getByText('Question (Français) est requis')).toBeVisible();
    await page.getByRole('button', { name: 'Annuler' }).click();
    await expect(page.getByRole('heading', { name: 'Questions fréquemment posées' })).toBeVisible();
  });
});

// The two "type list" pages share the same structure.
for (const { path: route, heading, field, editTitle } of [
  { path: 'gestion-recettes', heading: 'Types de recette', field: 'Nom du type de recette', editTitle: 'Modifier le type de recette' },
  { path: 'physiotherapie', heading: 'Packs et services', field: 'Nom du pack ou service', editTitle: 'Modifier le pack ou service' },
]) {
  test.describe(heading, () => {
    test('ajouter, renommer et supprimer', async ({ page }) => {
      const name = uid(heading);
      const renamed = `${name} bis`;
      await openAdminPage(page, route, heading);

      await page.getByLabel(field).fill(name);
      await page.getByRole('button', { name: 'Ajouter', exact: true }).click();
      const row = page.getByRole('row', { name: new RegExp(name) });
      await expect(row).toBeVisible();

      await row.getByRole('button', { name: 'Modifier' }).click();
      const modal = page.getByRole('dialog');
      await expect(modal).toContainText(editTitle);
      await modal.getByLabel(field).fill(renamed);
      await modal.getByRole('button', { name: 'Sauvegarder' }).click();
      await expect(modal).toHaveCount(0);

      const renamedRow = page.getByRole('row', { name: new RegExp(renamed) });
      await expect(renamedRow).toBeVisible();
      await deleteRowWithConfirm(page, renamedRow, 'Oui, supprimer');
    });
  });
}

test.describe('Services', () => {
  test('ajouter puis supprimer un service', async ({ page }) => {
    const name = uid('Service');
    await openAdminPage(page, 'services', 'Gestion des services');

    await page.locator('#service-nom').fill(name);
    await page.locator('#service-nom-ar').fill('خدمة اختبار');
    await page.locator('#service-desc').fill('Service créé par les tests e2e.');
    await page.getByRole('button', { name: 'Ajouter', exact: true }).click();

    const row = page.getByRole('row', { name: new RegExp(name) });
    await expect(row).toBeVisible();
    await deleteRowWithConfirm(page, row);
    await expect(page.getByText('Service supprimé avec succès')).toBeVisible();
  });
});

test.describe('Mises à jour', () => {
  test('créer puis supprimer avec la confirmation du back-office', async ({ page }) => {
    const title = uid('Actualité');
    await openAdminPage(page, 'updates', 'Mise à jour');
    // La section est unique : on ne touche pas à une mise à jour déjà publiée.
    test.skip(await page.getByRole('heading', { name: 'Modifier la mise à jour' }).isVisible(),
      'Une mise à jour existe déjà ; ce test ne crée que sur une base vide.');

    await page.locator('input[name="title_fr"]').fill(title);
    await page.locator('input[name="title_ar"]').fill('تحديث اختبار');
    await fillQuill(page, 'Description (Français)', 'Contenu de test.');
    await page.getByRole('button', { name: /^(Créer|Mettre à jour)$/ }).click();
    await expect(page.getByText(/Mise à jour (créée|modifiée) avec succès/)).toBeVisible();

    const row = page.getByRole('row', { name: new RegExp(title) });
    await expect(row).toBeVisible();
    await deleteRowWithConfirm(page, row);
    await expect(page.getByText('Mise à jour supprimée avec succès')).toBeVisible();
  });
});

test.describe('Qui sommes-nous', () => {
  test('créer puis supprimer une section', async ({ page }) => {
    const text = uid('Présentation');
    await openAdminPage(page, 'about-us', 'Qui sommes-nous');

    await page.getByRole('button', { name: 'Créer une nouvelle section' }).click();
    await fillQuill(page, 'Description (Français)', text);
    await fillQuill(page, 'Description (Arabe)', 'نص تجريبي للقسم');
    await page.getByRole('button', { name: /^(Enregistrer|Créer|Mettre à jour)/ }).last().click();
    await expect(page.getByText('Section créée avec succès')).toBeVisible();

    const row = page.getByRole('row', { name: new RegExp(text) });
    await expect(row).toBeVisible();
    await deleteRowWithConfirm(page, row);
    await expect(page.getByText('Section supprimée avec succès')).toBeVisible();
  });
});

test.describe('Section experts', () => {
  test('créer puis supprimer la section', async ({ page }) => {
    const title = uid('Experts');
    await openAdminPage(page, 'experts', 'Section Experts');
    test.skip(await page.getByRole('button', { name: 'Mettre à jour' }).isVisible(),
      'Une section Experts existe déjà ; ce test ne crée que sur une base vide.');

    await page.locator('input[name="Image"]').setInputFiles(IMAGE);
    await page.locator('input[name="TitleFR"]').fill(title);
    await page.locator('input[name="TitleAR"]').fill('خبراء');
    await fillQuill(page, 'Description (Français)', 'Description des experts.');
    await fillQuill(page, 'Description (Arabe)', 'وصف الخبراء');
    await page.getByRole('button', { name: 'Enregistrer' }).click();

    const row = page.getByRole('row', { name: new RegExp(title) });
    await expect(row).toBeVisible({ timeout: 20_000 });
    await deleteRowWithConfirm(page, row);
    await expect(page.getByText('Section supprimée avec succès')).toBeVisible();
  });
});
