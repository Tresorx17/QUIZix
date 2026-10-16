# Spec Delta

## Purpose

Permet aux utilisateurs de créer un compte, de s'authentifier sur la
plateforme et de disposer des droits liés à leur rôle.

## ADDED Requirements

### Requirement: Un utilisateur peut s'inscrire
Le système SHALL permettre à un visiteur de créer un compte en s'insrivant
avec un identifiant et un mot de passe.

#### Scenario: Inscription d'un compte
- **WHEN** un visiteur remplit le formulaire d'inscription
- **THEN** un compte est créé et l'utilisateur peut se connecter

### Requirement: Les mots de passe sont protégés
Le système SHALL protéger les mots de passe en les hachant avant leur
stockage.

#### Scenario: Stockage du mot de passe
- **WHEN** un compte est créé
- **THEN** le mot de passe n'est pas stocké en clair

### Requirement: Un utilisateur peut se connecter
Le système SHALL permettre à un utilisateur enregistré de se connecter avec
ses identifiants.

#### Scenario: Connexion avec identifiants valides
- **WHEN** un utilisateur se connecte avec des identifiants valides
- **THEN** sa session est ouverte et il accède à la plateforme

#### Scenario: Connexion avec des identifiants incorrects
- **WHEN** un visiteur se connecte avec un identifiant ou un mot de passe
  incorrect
- **THEN** la connexion est refusée et aucune session n'est ouverte

### Requirement: Un utilisateur peut se déconnecter
Le système SHALL permettre à un utilisateur connecté de se déconnecter, metant
sa session finie.

#### Scenario: Déconnexion
- **WHEN** un utilisateur se déconnecte
- **THEN** sa session est terminée et l'accès ultérieur nécessite une nouvelle
  connexion

### Requirement: La session d'un utilisateur est conservée pendant son usage
Le système SHALL conserver la session d'un utilisateur pendant qu'il utilise
la plateforme sans se déconnecter.

#### Scenario: Conservation de la session
- **WHEN** un utilisateur consulte plusieurs pages de la plateforme
- **THEN** sa session reste ouverte

### Requirement: Chaque compte est associé à un rôle
Le système SHALL associer à chaque compte un rôle unique, soit enseignant, soit élève.

#### Scenario: Attribution du rôle
- **WHEN** un compte est créé ou modifié
- **THEN** le compte possède exactement un rôle

### Requirement: Les droits accordés dépendent du rôle
Le système SHALL accorder à un utilisateur les droits correspondant à son rôle
et refuser l'accès aux actions réservées aux autres rôles.

#### Scenario: Accès réservé aux enseignants
- **WHEN** un élève tente de publier un quiz
- **THEN** la publication est refusée

### Requirement: Les identifiants sont transmis de manière sécurisée
Le système SHALL transmettre les identifiants de connexion uniquement via une
connexion sécurisée (HTTPS).

#### Scenario: Connexion sécurisée
- **WHEN** un utilisateur se connecte
- **THEN** les identifiants sont envoyés uniquement sur une connexion sécurisée
