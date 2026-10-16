# Design

## Context

Le projet QUIZix est actuellement un squelette Angular : le composant racine
affiche un écran de démarrage par défaut, les routes sont vides et le serveur
Express (`src/server.ts`) ne contient aucune fonctionnalité. La base de code
utilise déjà Angular 22 (composants autonomes, `signal`), le build Angular SSR
configuré dans `angular.json`, ainsi que le testeur unitaire Vitest.

Quatre capacités vont être introduites - `user-management`, `quiz-management`,
`quiz-taking` et `leaderboards` - voir `proposal.md` pour la motivation.
Aucune de ces capacités n'a de code existant : toute l'implémentation
démarrera de zéro sur la base du squelette.

Les contraintes suivantes guident ce document :

- aucune nouvelle dépendance externe ne doit être introduite ;
- la première version doit rester réalisable dans le cadre d'un devoir
  Angular ;
- les artefacts OpenSpec déjà présents dans `openspec/changes/quizix` -
  proposition, spécifications et plan - sont mis à jour en même temps que ce
  document.

## Goals / Non-Goals

**Goals :**

- Couvrir les quatre capacités listées dans le `proposal.md`.
- Respecter les conventions du projet existant : composants autonomes,
  gestion d'état via `signal`, serveur de rendu côté serveur Express déjà
  présent, tests unitaires Vitest.
- Garder la première version réalisable sans infrastructure externe.

**Non-Goals :**

- Aucun backend dédié en dehors du serveur Express déjà présent : la
  plateforme reste utilisée localement.
- Aucun déploiement, aucun compte administrateur, aucune API publique.
- Aucune fonctionnalité temps réel, hors du périmètre listé.
- Ce changement est purement planning : aucune ligne de code n'est écrite
  avant la revue des artefacts OpenSpec.

## Decisions

**Décision 1 - Architecture des composants :**

Utiliser les composants autonomes Angular déjà en place (standalone
components) organisés par capacité, avec un état local via `signal` jusqu'à
l'émergence d'une complexité prouvée. Les échanges entre capacités passent
par un service dédié par capacité, sans passerelle intermédiaire.

- Alternatives envisagées : NgRx (écarté : état local suffisant, évite une
  nouvelle dépendance), module lourd par domaine (écarté : plus de fichiers,
  hors périmètre devoir).

**Décision 2 - Persistance :**

Les données (quizs, questions, tentatives, résultats) sont persistées côté
client, dans le stockage du navigateur local du poste. Le serveur Express
reste un serveur de rendu et d'API locale.

- Alternatives envisagées : serveur dédié (rejeté : périmètre de devoir),
  base de données externe (rejetée : aucune dépendance introduite).

**Décision 3 - Authentification :**

L'authentification repose sur des sessions côté serveur : un cookie de
session HTTP-only établi par le serveur Express. L'identifiant et le mot de
passe sont transmis uniquement via une connexion sécurisée (HTTPS).

- Alternatives envisagées : jeton stocké côté client (réservé à un usage sans
  la sécurité des cookies), comptes provisionnés par un administrateur (hors
  périmètre).

**Décision 4 - Nombre de capacités :**

Quatre capacités sont introduites, dont `user-management`, car
l'authentification et les rôles sont transverses aux capacités métier : sans
elles, aucune autre capacité ne peut définir qui agit et quelles actions
restreintes sont autorisées.

- Alternatives envisagées : intégrer ces exigences aux capacités métier
  (rejeté : elles doivent évoluer indépendamment de la logique de quiz).

**Décision 5 - Difficulté progressive :**

Dans cette première version, la difficulté d'une tentative croît progressivement
au fil des questions : chaque question suivante est au moins aussi difficile
que la précédente.

- Alternative envisagée : difficulté par paliers prédéfinis (écartée : plus
  simple à implémenter, alignée sur le devoir).

**Décision 6 - Stratégie de tests :**

Les tests restent ceux du projet : Vitest via le builder `ng test`.
Chaque tâche de ce document liste sa propre vérification, sans ajout de
framework ou de structure de test.

- Alternatives envisagées : ajouter un framework de tests supplémentaire
  (écarté : reste réalisable dans un devoir).

## Risks / Trade-offs

- [Risque] La persistance côté client est perdue si le poste de l'utilisateur
  supprime les données du navigateur. → Mitigation : documenté ; acceptable
  pour une plateforme locale et scolaire.

- [Risque] La connexion sécurisée exige HTTPS, absent du serveur de
  développement local. → Mitigation : le serveur de développement expose
  HTTPS ; un déploiement avec HTTPS sera nécessaire (hors périmètre de cette
  version).

- [Risque] Les filtres et la recherche couvriront un périmètre réduit au
  démarrage. → Mitigation : seuls le thème et la durée sont filtrés au départ ;
  le reste est différé dans un changement ultérieur.

- [Risque] Les droits sont vérifiés côté serveur, mais la couche client peut
  afficher des éléments réservés au rôle courant. → Mitigation : le client ne
  présente que les actions autorisées ; le refus reste géré côté serveur.

## Plan de déploiement et de retour

Ce changement ne comporte aucune application existante à migrer : le projet
reste au stade du squelette Angular. Le déploiement se fait par accumulation
de fonctionnalités, dans l'ordre des groupes de tâches. Aucun rollback n'est
nécessaire tant que la version n'est pas encore en usage ; le serveur Express
existant est étendu par ajout d'endpoints, sans remplacement de la pile.

## Open Questions

Aucune question ouvertement résiduelle : les ambiguïtés mineures
(définition de la difficulté progressive, persistance des données) ont été
résolues dans les artefacts correspondants.
