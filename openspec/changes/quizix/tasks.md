# Tasks

## 1. Configuration et structure

- [x] 1.1 Vérifier la structure existante du squelette Angular, adapter le composant racine si nécessaire (vérifier la présence des fichiers attendus)
- [x] 1.2 Structurer les modules de fonctionnalités pour les quatre capacités - `user-management`, `quiz-management`, `quiz-taking` et `leaderboards` - et vérifier la présence des fichiers attendus

## 2. Capacités d'authentification et de rôles

- [x] 2.1 Créer le modèle des utilisateurs, des comptes et des rôles, et vérifier le modèle
- [x] 2.2 Implémenter l'inscription et la connexion, et vérifier le comportement observable
- [x] 2.3 Implémenter la déconnexion et la conservation de la session, et vérifier le comportement observable
- [x] 2.4 Implémenter le contrôle des droits selon le rôle, et vérifier le comportement observable
- [x] 2.5 Écrire les tests couvrant l'inscription, la connexion et les droits, et vérifier que ces tests passent

## 3. Capacités de gestion des quiz

- [x] 3.1 Créer le modèle des quiz et des questions, et vérifier le modèle
- [x] 3.2 Implémenter le CRUD des quiz et des questions (création, modification, suppression), et vérifier le comportement observable
- [x] 3.3 Implémenter la publication des quiz, et vérifier que seuls les quiz publiés sont accessibles aux élèves
- [x] 3.4 Implémenter le tableau de bord enseignant, et vérifier le comportement observable
- [x] 3.5 Écrire les tests couvrant la création, la modification, la suppression et la publication, et vérifier que ces tests passent

## 4. Capacités de passage des quiz

- [x] 4.1 Créer le modèle des tentatives et du chronomètre, et vérifier le modèle
- [x] 4.2 Implémenter le lancement d'un quiz par un élève et la gestion des réponses pendant le chronomètre, et vérifier le comportement observable
- [x] 4.3 Implémenter la difficulté progressive et la recherche / filtres du catalogue, et vérifier le comportement observable
- [x] 4.4 Implémenter le calcul de la note et la correction automatique à la fin de la tentative, et vérifier le comportement observable
- [x] 4.5 Écrire les tests couvrant le lancement des quiz, les réponses et la correction, et vérifier que ces tests passent

## 5. Capacités de classement

- [x] 5.1 Créer le modèle des résultats des tentatives et leur contribution au classement, et vérifier le modèle
- [x] 5.2 Implémenter le calcul du classement et son affichage, et vérifier le comportement observable
- [x] 5.3 Gérer le cas des égalités de score dans le classement, et vérifier le comportement observable
- [x] 5.4 Écrire les tests couvrant le calcul et l'affichage du classement, et vérifier que ces tests passent

## Workflow follow-up

- Traiter les fonctionnalités hors du périmètre de la première version, éventuellement dans un changement ultérieur.
- Archiver le changement une fois les exigences de revue du projet satisfaites.
- Vérifier le résultat de l'archivage.

## Points ouverts identifiés lors de la vérification

- `user-management` demande que les mots de passe soient hachés avant stockage.
  La version livrée est une démonstration sans serveur : les comptes vivent dans
  le `localStorage` du navigateur et les mots de passe y sont en clair (voir
  `src/app/core/auth.service.ts` et `src/app/core/models.ts`). Satisfaire cette
  exigence suppose un stockage côté serveur.
- La décision 3 de `design.md` (sessions côté serveur avec cookie HTTP-only)
  n'est pas appliquée pour la même raison : la session est conservée dans le
  navigateur. Le reste de la décision (identifiants transmis en HTTPS) est
  respecté en production, où le site est servi en HTTPS.
