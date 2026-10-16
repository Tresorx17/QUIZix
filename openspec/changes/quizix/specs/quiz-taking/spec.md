# Spec Delta

## Purpose

Permet aux élèves de passer un quiz, de répondre à ses questions dans le cadre d'un chronomètre, et de recevoir une correction automatique.

## ADDED Requirements

### Requirement: Un élève peut lancer un quiz disponible
Le système SHALL permettre à un élève de lancer un quiz qui a été publié.

#### Scenario: Lancement d'un quiz
- **WHEN** un élève lance un quiz publié
- **THEN** le quiz démarre et la tentative est enregistrée

### Requirement: Les réponses sont enregistrées pendant le chronomètre
Le système SHALL enregistrer la réponse donnée par un élève pendant que le chronomètre est actif.

#### Scenario: Réponse pendant le chronomètre
- **WHEN** un élève répond à une question pendant le chronomètre actif
- **THEN** sa réponse est enregistrée immédiatement

### Requirement: Une réponse ne peut être donnée après la fin du chronomètre
Le système SHALL ignorer toute réponse donnée après la fin du chronomètre.

#### Scenario: Réponse après expiration
- **WHEN** le chronomètre atteint zéro
- **THEN** toute réponse envoyée après cette instant est ignorée

### Requirement: La note est calculée à la fin de la tentative
Le système SHALL clôturer la tentative et calculer la note dès que le chronomètre atteint zéro.

#### Scenario: Clôture de la tentative
- **WHEN** le chronomètre atteint zéro
- **THEN** la tentative est clôturée et la note est calculée

### Requirement: L'élève reçoit sa note et la correction après la tentative
Le système SHALL fournir à l'élève sa note et la correction de chaque question après la fin de la tentative.

#### Scenario: Consultation de la correction
- **WHEN** l'élève consulte ses résultats après la tentative
- **THEN** il voit sa note et la correction de chaque question

### Requirement: Le chronomètre est visible pendant la tentative
Le système SHALL afficher un chronomètre actif pendant toute la durée d'une tentative.

#### Scenario: Visualisation du chronomètre
- **WHEN** un élève lance un quiz publié
- **THEN** un chronomètre est affiché et s'écoule jusqu'à zéro

### Requirement: La difficulté d'une question augmente progressivement
Le système SHALL faire croître la difficulté des questions au fil des questions d'une même tentative : chaque question est au moins aussi difficile que la précédente.

#### Scenario: Difficulté progressive
- **WHEN** l'élève enchaîne les questions d'une tentative
- **THEN** chaque question est au moins aussi difficile que la précédente

### Requirement: Un élève peut rechercher et filtrer le catalogue
Le système SHALL permettre à un élève de rechercher et de filtrer le catalogue des quiz disponibles.

#### Scenario: Recherche dans le catalogue
- **WHEN** un élève saisit une recherche dans la liste des quiz
- **THEN** seuls les quiz dont le titre ou la description correspondent sont affichés

#### Scenario: Filtrage du catalogue
- **WHEN** l'élève applique des filtres au catalogue
- **THEN** seuls les quiz correspondant aux filtres sont affichés
