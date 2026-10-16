# quiz-management Specification

## Purpose

Permet aux enseignants de créer des quiz, de définir leurs questions et de publier ces quiz.

## Requirements

### Requirement: Un enseignant peut créer un quiz
Le système SHALL permettre à un enseignant de créer un quiz, qui apparaît alors dans la liste des quiz de cet enseignant.

#### Scenario: Création d'un quiz
- **WHEN** un enseignant crée un nouveau quiz
- **THEN** le quiz est créé dans l'état brouillon et apparaît dans la liste des quiz de cet enseignant

### Requirement: Un enseignant peut définir les questions d'un quiz
Le système SHALL permettre à un enseignant de définir les questions d'un quiz, chaque question étant une question à choix multiples.

#### Scenario: Ajout d'une question
- **WHEN** un enseignant ajoute une question à un quiz en brouillon
- **THEN** la question est enregistrée avec ses options à choix multiples et sa réponse correcte

### Requirement: Un enseignant peut publier un quiz
Le système SHALL permettre à un enseignant de publier un quiz en brouillon, et le système enregistre l'état du quiz comme publié.

#### Scenario: Publication d'un quiz
- **WHEN** un enseignant publie un quiz en brouillon
- **THEN** le quiz devient disponible pour les élèves et son état est enregistré comme publié

### Requirement: Un quiz n'est disponible pour les élèves qu'une fois publié
Le système SHALL garantir qu'un quiz n'est accessible aux élèves que lorsqu'il est publié.

#### Scenario: Accès avant publication
- **WHEN** un élève consulte la liste des quiz disponibles
- **THEN** seuls les quiz publiés y figurent

### Requirement: Un enseignant peut modifier un quiz qui n'est pas encore publié
Le système SHALL permettre à un enseignant de modifier le contenu d'un quiz qui n'a pas encore été publié.

#### Scenario: Modification en cours de brouillon
- **WHEN** un enseignant modifie le contenu d'un quiz non publié
- **THEN** les élèves ne voient pas ces modifications

### Requirement: Un enseignant peut supprimer un quiz
Le système SHALL permettre à un enseignant de supprimer un quiz qu'il peut modifier.

#### Scenario: Suppression d'un quiz
- **WHEN** un enseignant supprime un quiz en brouillon
- **THEN** le quiz est retiré de la liste des quiz et ses questions ne sont plus consultables

### Requirement: Un enseignant peut supprimer une question
Le système SHALL permettre à un enseignant de supprimer une question d'un quiz en brouillon.

#### Scenario: Suppression d'une question
- **WHEN** un enseignant supprime une question d'un quiz
- **THEN** la question disparaît du quiz et les autres questions ne sont pas affectées

### Requirement: Un enseignant peut consulter un tableau de bord
Le système SHALL fournir à un enseignant un tableau de bord de gestion des quiz.

#### Scenario: Consultation du tableau de bord
- **WHEN** un enseignant consulte le tableau de bord
- **THEN** il voit des indicateurs sur les quiz publiés, sur les tentatives enregistrées, ainsi que le score moyen obtenu
