# Proposition

## Pourquoi

Le projet QUIZix est encore au stade du squelette Angular : l'application
affiche aujourd'hui un seul écran de démarrage et aucune fonctionnalité de
quiz n'existe encore. Sans spécification, son développement manque de
contrat, et ni les enseignants ni les élèves ne disposent d'un socle commun
sur ce que la plateforme doit faire.

Écrire ces exigences maintenant, avant tout code, donne à la base existante
une cible claire et offre un périmètre durable aux deux utilisateurs de la
plateforme : les enseignants qui la publient et les élèves qui la parcourent.

## Quoi changer

Introduire la première version de QUIZix, à travers quatre nouvelles
capacités :

- **`user-management`** : inscription, connexion et déconnexion avec
  authentification sécurisée, puis attribution de rôles et de droits.
- **`quiz-management`** : cycle de vie complet des quiz et des questions -
  création, modification, suppression, publication - ainsi qu'un tableau
  de bord enseignant.
- **`quiz-taking`** : parcours des élèves - catalogue consultable et filtrable,
  passage chronométré d'un quiz, difficulté progressive, note et
  correction automatique.
- **`leaderboards`** : consultation du classement établi à partir des
  résultats des tentatives.

Aucune capacité existante n'est modifiée : `openspec/specs/` ne contient
encore aucune spécification, et aucune exigence hors du périmètre de ce
changement ne change au niveau des spécifications.

Le jeu peut s'inspirer du principe des jeux télévisés de questions à choix
multiples, mais doit conserver un nom et une identité visuelle originels,
sans reprendre la marque ni le design d'une émission existante.

Les principaux parcours utilisateurs sont les suivants :

- le parcours **enseignant** : créer et publier des quiz, gérer leur contenu
  et consulter des indicateurs ;
- le parcours **élève** : parcourir le catalogue, passer un quiz chronométré,
  recevoir sa note et consulter le classement.

## Capacités

### Nouvelles capacités

- `user-management` : authentification et rôles - inscription, connexion,
  déconnexion, sessions sécurisées, et droits accordés selon le rôle.
- `quiz-management` : cycle de vie des quiz et de leurs questions - création,
  modification, suppression, publication par les enseignants, et tableau
  de bord enseignant.
- `quiz-taking` : parcours des élèves - catalogue consultable et filtrable,
  passage chronométré, difficulté progressive, note et correction
  automatique.
- `leaderboards` : classement - consultation du classement établi à partir
  des résultats des tentatives.

### Capacités existantes modifiées

- _Aucune._ Aucune spécification existante n'est en train de changer : le
  répertoire `openspec/specs/` est vide.

## Impact

- **Code affecté** : `src/app` ne contient que le squelette Angular (composant
  racine et routes vides). Toute la fonctionnalité de quiz sera du code
  nouveau ; rien ne doit être supprimé. Le serveur local existant
  (`src/server.ts`) correspond déjà à une application locale et sert de
  point d'entrée au rendu côté serveur.
- **Systèmes affectés** : aucun externe - l'application fonctionne entièrement
  localement, dans le navigateur et le serveur Node local.
- **Dépendances** : aucune nouvelle - la chaîne Angular 22 déjà présente
  suffit, et aucune librairie supplémentaire n'est introduite.
- **Contraintes de périmètre** : la première version reste réalisable dans le
  cadre d'un devoir Angular ; les tâches sont découpées en petits groupes,
  sans infrastructure externe. Aucun code n'est écrit avant la revue de
  ces artefacts.
