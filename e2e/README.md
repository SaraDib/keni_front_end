# Tests end-to-end du back-office

Tests Playwright qui pilotent le vrai back-office (`/admin`) contre une API Laravel locale.

## Prérequis

1. L'API Laravel tourne (par défaut `http://127.0.0.1:8001`) sur une base **MySQL** migrée et seedée :
   `php artisan migrate --seed`, puis un compte administrateur.
2. Le front tourne avec `REACT_APP_API_URL` pointant vers cette API (voir `.env.local`), par défaut sur `http://localhost:3001`.
3. Microsoft Edge est installé (utilisé par défaut). Pour un autre navigateur : `npx playwright install chromium` puis `E2E_CHANNEL=` (vide).

## Lancer

```bash
E2E_EMAIL=admin@exemple.com E2E_PASSWORD=... npm run test:e2e
```

PowerShell :

```powershell
$env:E2E_EMAIL='admin@exemple.com'; $env:E2E_PASSWORD='...'; npm run test:e2e
```

Variables optionnelles : `E2E_BASE_URL` (URL du front), `E2E_CHANNEL` (`msedge`, `chrome` ou vide).

Rapport HTML : `npx playwright show-report e2e/report`.

## Ce qui est couvert

- **Authentification** : redirection sans session, mauvais mot de passe, connexion / déconnexion.
- **Navigation** : chaque entrée du menu ouvre sa page (titre, fil d'Ariane, aucune bannière d'erreur), menu mobile, route inconnue.
- **Contenus** (création → modification → suppression avec la boîte de confirmation) : FAQ, types de recette, packs et services, services, mises à jour, « Qui sommes-nous », section experts.
- **Administration** : paramètres (modification conservée après rechargement, puis restaurée), liste des utilisateurs.

Chaque test échoue aussi si la page lève une erreur JavaScript, si l'API répond 5xx ou 429, ou si une boîte de dialogue native du navigateur (`alert` / `confirm`) apparaît.

Les données créées portent la mention `e2e` et sont supprimées par les tests eux-mêmes. Lancez la suite sur une base locale, jamais sur la production.
