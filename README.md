# QUIZix

Devoir Angular en développement frontend avancé.

QUIZix est une plateforme de quiz en classe, en français : les enseignants créent,
modifient et publient des quiz ; les élèves parcourent un catalogue, passent les
quiz chronométrés à difficulté progressive, reçoivent leur note et consultent le
classement.

## Démo en ligne

<https://quizix-beta.vercel.app>

L'application tourne en **rendu côté serveur (SSR)** sur Vercel : le dépôt est
connecté au projet, chaque push sur `main` redéploie automatiquement.

## Fonctionnalités

- Authentification : inscription, connexion, déconnexion, session conservée ;
  rôles **enseignant** et **élève** avec droits distincts.
- Gestion des quiz : création, modification et suppression des quiz et de leurs
  questions, publication et retrait de la publication.
- Tableau de bord enseignant : indicateurs (quiz publiés, brouillons, tentatives,
  score moyen) et actions sur chaque quiz.
- Passage d'un quiz : catalogue consultable et filtrable, chronomètre, difficulté
  progressive, correction automatique et note.
- Classement : élèves classés par score moyen, égalités gérées.

## Démarrage

```bash
npm install
npm start          # serveur de développement : http://localhost:4200/
```

## Build et tests

```bash
npm run build      # build de production (SSR) dans dist/
npm test           # tests unitaires (Vitest)
```

## Comptes de démonstration

Les données sont simulées côté navigateur (`localStorage`) : aucun backend, aucun
service externe. Les mots de passe ci-dessous sont des identifiants de
démonstration, pas des secrets.

| Rôle      | Identifiant                | Mot de passe |
| --------- | -------------------------- | ------------ |
| Enseignant | `professeur`              | `quizix`     |
| Élève      | `eleve`, `marie`, `paul`  | `quizix`     |

## Structure du projet

- `src/app/core/` — modèles et services (authentification, quiz, partie en cours)
- `src/app/auth/` , `src/app/teacher/` , `src/app/student/` , `src/app/leaderboard/` — écrans
- `src/styles.css` — thème global (bleu nuit, ivoire, accents dorés et corail)
- `openspec/` — spécifications et suivi du changement (OpenSpec)

## Déploiement

L'application est déployée sur Vercel en **rendu côté serveur (SSR)** : aucune
page n'est servie comme fichier statique figé, chaque requête passe par une
fonction Node qui exécute le serveur Angular Express (`src/server.ts`).

| Fichier         | Rôle                                                                                                                                                     |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `vercel.json`   | `npm run build`, sortie `dist/QUIZix/browser`, fonction `api/index.mjs`, et réécriture de toutes les routes (`/` compris) vers cette fonction              |
| `api/index.mjs` | Point d'entrée serverless : ré-exporte le `reqHandler` produit par le build (`dist/QUIZix/server/server.mjs`), qui gère rendu, routes et fichiers statiques |
| `angular.json`  | `security.allowedHosts` : domaines autorisés à déclencher le rendu, protection anti-SSRF d'Angular                                                         |

Le build produit le serveur SSR, et `includeFiles` embarque `dist/QUIZix/**`
(serveur + fichiers statiques) dans le bundle de la fonction.

Déploiement : le dépôt est connecté au projet Vercel `quizix`. Un push sur
`main` déclenche un déploiement de production, et `vercel.json` pilote toute la
configuration (aucun réglage à faire dans l'interface). Pour déployer sans
passer par Git : `npm i -g vercel` puis `vercel --prod`.

> **Domaine personnalisé** : Angular bloque par défaut les domaines non déclarés.
> Pour utiliser un autre domaine que `*.vercel.app`, l'ajouter à
> `security.allowedHosts` dans `angular.json` puis redéployer, sinon le rendu
> répond `400 Bad Request`.
