# QUIZix

Devoir Angular en développement frontend avancé.

QUIZix est une plateforme de quiz en classe, en français : les enseignants créent,
modifient et publient des quiz ; les élèves parcourent un catalogue, passent les
quiz chronométrés à difficulté progressive, reçoivent leur note et consultent le
classement.

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

Application Angular avec rendu côté serveur (SSR), déployée sur Vercel.
