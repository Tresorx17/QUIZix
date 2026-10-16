# Spec Delta

## Purpose

Permet aux élèves de consulter un classement basé sur leurs résultats.

## ADDED Requirements

### Requirement: Le système calcule un classement à partir des résultats
Le système SHALL calculer un classement à partir des résultats obtenus par les élèves.

#### Scenario: Calcul du classement
- **WHEN** les résultats d'une tentative sont enregistrés
- **THEN** ils participent au calcul du classement

### Requirement: Le classement est établi selon le score total
Le système SHALL établir le classement selon le score total obtenu par chaque élève.

#### Scenario: Ordre du classement
- **WHEN** le classement est consulté
- **THEN** les élèves sont classés par leur score total, du plus élevé au plus bas

### Requirement: Un élève peut consulter le classement
Le système SHALL permettre à un élève de consulter le classement.

#### Scenario: Consultation du classement
- **WHEN** un élève consulte le classement
- **THEN** il voit le classement et le rang de chaque élève

### Requirement: Le classement tient compte des égalités de score
Le système SHALL établir un ordre déterministe entre les élèves ayant le même score total.

#### Scenario: Résolution d'une égalité
- **WHEN** deux élèves ont le même score total
- **THEN** le système classe ces élèves selon leur identifiant, de façon déterministe
