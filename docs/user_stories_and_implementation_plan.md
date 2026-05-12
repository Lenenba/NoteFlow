# User Stories & Implementation Plan
## Application de Pratique Musicale Interactive

---

## 📋 Table des Matières

1. [User Stories par Persona](#user-stories-par-persona)
2. [User Stories par Epic](#user-stories-par-epic)
3. [Plan d'Implémentation Détaillé](#plan-dimplémentation-détaillé)
4. [Roadmap Visuelle](#roadmap-visuelle)
5. [Critères d'Acceptation](#critères-dacceptation)

---

## 🎭 User Stories par Persona

### Persona 1: Marie - Débutante au Piano (25 ans)

**US-001**: En tant que débutante, je veux voir une liste de chansons simples pour pouvoir choisir un exercice adapté à mon niveau.
- **Priorité**: Haute
- **Sprint**: 1
- **Points**: 3

**US-002**: En tant que débutante, je veux connecter mon clavier MIDI facilement pour que l'application détecte mes notes.
- **Priorité**: Haute
- **Sprint**: 2
- **Points**: 5

**US-003**: En tant que débutante, je veux voir les accords arriver progressivement vers une ligne pour savoir quand les jouer.
- **Priorité**: Haute
- **Sprint**: 2
- **Points**: 8

**US-004**: En tant que débutante, je veux recevoir un feedback immédiat (Perfect/Good/Wrong) pour savoir si j'ai bien joué.
- **Priorité**: Haute
- **Sprint**: 3
- **Points**: 8

**US-005**: En tant que débutante, je veux voir mon score en temps réel pour suivre ma progression pendant l'exercice.
- **Priorité**: Moyenne
- **Sprint**: 3
- **Points**: 5

**US-006**: En tant que débutante, je veux pouvoir mettre en pause et recommencer pour m'entraîner à mon rythme.
- **Priorité**: Haute
- **Sprint**: 2
- **Points**: 3

**US-007**: En tant que débutante, je veux voir un résumé de ma performance à la fin pour comprendre mes erreurs.
- **Priorité**: Moyenne
- **Sprint**: 3
- **Points**: 5

---

### Persona 2: Thomas - Guitariste Intermédiaire (32 ans)

**US-008**: En tant que guitariste, je veux créer mes propres progressions d'accords pour pratiquer mes compositions.
- **Priorité**: Moyenne
- **Sprint**: 4
- **Points**: 13

**US-009**: En tant que guitariste, je veux ajuster le BPM d'un exercice pour pratiquer à différentes vitesses.
- **Priorité**: Basse
- **Sprint**: 5
- **Points**: 5

**US-010**: En tant que guitariste, je veux voir l'historique de mes sessions pour suivre ma progression dans le temps.
- **Priorité**: Basse
- **Sprint**: 5
- **Points**: 8

**US-011**: En tant que guitariste, je veux transposer une chanson dans une autre tonalité pour l'adapter à ma voix.
- **Priorité**: Basse
- **Sprint**: 6
- **Points**: 8

---

### Persona 3: Sophie - Professeure de Musique (45 ans)

**US-012**: En tant que professeure, je veux créer des exercices personnalisés pour mes élèves avec des accords spécifiques.
- **Priorité**: Basse
- **Sprint**: 7
- **Points**: 13

**US-013**: En tant que professeure, je veux assigner des exercices à mes élèves pour structurer leur apprentissage.
- **Priorité**: Basse
- **Sprint**: 8
- **Points**: 13

**US-014**: En tant que professeure, je veux voir les statistiques de progression de mes élèves pour adapter mon enseignement.
- **Priorité**: Basse
- **Sprint**: 8
- **Points**: 8

**US-015**: En tant que professeure, je veux laisser des commentaires sur les performances de mes élèves pour les guider.
- **Priorité**: Basse
- **Sprint**: 8
- **Points**: 5

---

### Persona 4: David - Musicien d'Église (28 ans)

**US-016**: En tant que musicien d'église, je veux importer des chansons au format ChordPro pour pratiquer notre répertoire.
- **Priorité**: Basse
- **Sprint**: 9
- **Points**: 13

**US-017**: En tant que musicien d'église, je veux créer des playlists de chansons pour préparer un service complet.
- **Priorité**: Basse
- **Sprint**: 9
- **Points**: 8

**US-018**: En tant que musicien d'église, je veux partager mes exercices avec mon équipe pour que nous pratiquions ensemble.
- **Priorité**: Basse
- **Sprint**: 10
- **Points**: 8

---

## 🎯 User Stories par Epic

### Epic 1: Infrastructure de Base (MVP Core)

**US-019**: En tant que développeur, je veux configurer Laravel + Inertia + React pour avoir une base solide.
- **Priorité**: Critique
- **Sprint**: 1
- **Points**: 8

**US-020**: En tant que développeur, je veux créer le modèle de données (songs, song_events, practice_sessions) pour stocker les informations.
- **Priorité**: Critique
- **Sprint**: 1
- **Points**: 13

**US-021**: En tant que développeur, je veux créer un seeder avec une chanson de démonstration pour tester l'application.
- **Priorité**: Critique
- **Sprint**: 1
- **Points**: 5

---

### Epic 2: Interface de Pratique

**US-022**: En tant qu'utilisateur, je veux voir une page de pratique avec les informations de la chanson (titre, BPM, durée).
- **Priorité**: Haute
- **Sprint**: 1
- **Points**: 5

**US-023**: En tant qu'utilisateur, je veux voir les accords de la chanson affichés en liste pour avoir un aperçu.
- **Priorité**: Haute
- **Sprint**: 1
- **Points**: 3

**US-024**: En tant qu'utilisateur, je veux des boutons Play/Pause/Restart pour contrôler l'exercice.
- **Priorité**: Haute
- **Sprint**: 2
- **Points**: 5

---

### Epic 3: Moteur de Temps Musical

**US-025**: En tant que développeur, je veux créer un scheduler musical précis pour synchroniser les événements.
- **Priorité**: Critique
- **Sprint**: 2
- **Points**: 13

**US-026**: En tant qu'utilisateur, je veux que l'accord actif change automatiquement selon le temps pour suivre la progression.
- **Priorité**: Haute
- **Sprint**: 2
- **Points**: 5

**US-027**: En tant qu'utilisateur, je veux voir un indicateur de temps courant pour savoir où j'en suis dans la chanson.
- **Priorité**: Moyenne
- **Sprint**: 2
- **Points**: 3

---

### Epic 4: Animation Canvas

**US-028**: En tant qu'utilisateur, je veux voir les blocs d'accords avancer vers une ligne de validation pour anticiper.
- **Priorité**: Haute
- **Sprint**: 2
- **Points**: 13

**US-029**: En tant qu'utilisateur, je veux une animation fluide à 60 FPS pour une expérience agréable.
- **Priorité**: Haute
- **Sprint**: 2
- **Points**: 8

**US-030**: En tant qu'utilisateur, je veux voir différentes couleurs par accord pour les distinguer visuellement.
- **Priorité**: Basse
- **Sprint**: 5
- **Points**: 3

---

### Epic 5: Détection MIDI

**US-031**: En tant qu'utilisateur, je veux que l'application demande l'accès à mon périphérique MIDI automatiquement.
- **Priorité**: Haute
- **Sprint**: 2
- **Points**: 8

**US-032**: En tant qu'utilisateur, je veux voir la liste des périphériques MIDI disponibles pour choisir le bon.
- **Priorité**: Moyenne
- **Sprint**: 2
- **Points**: 5

**US-033**: En tant qu'utilisateur, je veux voir les notes que je joue en temps réel pour vérifier la connexion.
- **Priorité**: Moyenne
- **Sprint**: 2
- **Points**: 5

**US-034**: En tant qu'utilisateur, je veux un message clair si aucun périphérique MIDI n'est détecté.
- **Priorité**: Moyenne
- **Sprint**: 3
- **Points**: 3

---

### Epic 6: Reconnaissance d'Accords

**US-035**: En tant que développeur, je veux convertir les notes MIDI en noms de notes (C, D, E, etc.).
- **Priorité**: Haute
- **Sprint**: 3
- **Points**: 5

**US-036**: En tant que développeur, je veux reconnaître les accords majeurs à partir des notes jouées.
- **Priorité**: Haute
- **Sprint**: 3
- **Points**: 8

**US-037**: En tant que développeur, je veux reconnaître les accords mineurs à partir des notes jouées.
- **Priorité**: Haute
- **Sprint**: 3
- **Points**: 5

**US-038**: En tant que développeur, je veux gérer les inversions d'accords pour plus de flexibilité.
- **Priorité**: Moyenne
- **Sprint**: 3
- **Points**: 8

**US-039**: En tant qu'utilisateur, je veux voir l'accord détecté affiché en temps réel pour confirmer ce que je joue.
- **Priorité**: Haute
- **Sprint**: 3
- **Points**: 3

---

### Epic 7: Validation et Feedback

**US-040**: En tant qu'utilisateur, je veux que l'application compare mon accord avec l'accord attendu.
- **Priorité**: Critique
- **Sprint**: 3
- **Points**: 13

**US-041**: En tant qu'utilisateur, je veux recevoir un feedback "Perfect" si je joue au bon moment (±50ms).
- **Priorité**: Haute
- **Sprint**: 3
- **Points**: 5

**US-042**: En tant qu'utilisateur, je veux recevoir un feedback "Good" si je joue avec un léger décalage (±150ms).
- **Priorité**: Haute
- **Sprint**: 3
- **Points**: 3

**US-043**: En tant qu'utilisateur, je veux recevoir un feedback "Early" si je joue trop tôt.
- **Priorité**: Haute
- **Sprint**: 3
- **Points**: 3

**US-044**: En tant qu'utilisateur, je veux recevoir un feedback "Late" si je joue trop tard.
- **Priorité**: Haute
- **Sprint**: 3
- **Points**: 3

**US-045**: En tant qu'utilisateur, je veux recevoir un feedback "Wrong" si je joue le mauvais accord.
- **Priorité**: Haute
- **Sprint**: 3
- **Points**: 3

**US-046**: En tant qu'utilisateur, je veux recevoir un feedback "Miss" si je ne joue rien.
- **Priorité**: Haute
- **Sprint**: 3
- **Points**: 3

**US-047**: En tant qu'utilisateur, je veux voir le feedback avec une animation visuelle pour plus d'impact.
- **Priorité**: Moyenne
- **Sprint**: 5
- **Points**: 5

---

### Epic 8: Scoring et Sessions

**US-048**: En tant qu'utilisateur, je veux que mon score augmente quand je joue correctement.
- **Priorité**: Haute
- **Sprint**: 3
- **Points**: 8

**US-049**: En tant qu'utilisateur, je veux voir mon accuracy (pourcentage de réussite) en temps réel.
- **Priorité**: Moyenne
- **Sprint**: 3
- **Points**: 5

**US-050**: En tant qu'utilisateur, je veux voir mon streak (série de réussites) pour me motiver.
- **Priorité**: Basse
- **Sprint**: 5
- **Points**: 5

**US-051**: En tant qu'utilisateur, je veux que ma session soit sauvegardée automatiquement.
- **Priorité**: Haute
- **Sprint**: 3
- **Points**: 8

**US-052**: En tant qu'utilisateur, je veux voir un écran de résumé avec mes statistiques à la fin.
- **Priorité**: Haute
- **Sprint**: 3
- **Points**: 8

**US-053**: En tant qu'utilisateur, je veux voir le détail de chaque événement (Perfect, Good, Wrong, Miss).
- **Priorité**: Moyenne
- **Sprint**: 4
- **Points**: 5

---

### Epic 9: Éditeur d'Exercices

**US-054**: En tant qu'utilisateur, je veux créer une nouvelle chanson avec un titre et un BPM.
- **Priorité**: Moyenne
- **Sprint**: 4
- **Points**: 8

**US-055**: En tant qu'utilisateur, je veux ajouter des accords manuellement avec leur timing.
- **Priorité**: Moyenne
- **Sprint**: 4
- **Points**: 13

**US-056**: En tant qu'utilisateur, je veux voir un aperçu de ma timeline avant de sauvegarder.
- **Priorité**: Basse
- **Sprint**: 4
- **Points**: 8

**US-057**: En tant qu'utilisateur, je veux modifier ou supprimer des accords existants.
- **Priorité**: Basse
- **Sprint**: 4
- **Points**: 5

**US-058**: En tant qu'utilisateur, je veux dupliquer une chanson existante pour créer des variations.
- **Priorité**: Basse
- **Sprint**: 5
- **Points**: 5

---

### Epic 10: Améliorations Visuelles

**US-059**: En tant qu'utilisateur, je veux voir des effets visuels (particules, flash) sur Perfect.
- **Priorité**: Basse
- **Sprint**: 5
- **Points**: 5

**US-060**: En tant qu'utilisateur, je veux voir des effets visuels (shake, rouge) sur Wrong.
- **Priorité**: Basse
- **Sprint**: 5
- **Points**: 5

**US-061**: En tant qu'utilisateur, je veux voir une mini timeline en bas pour me situer dans la chanson.
- **Priorité**: Basse
- **Sprint**: 5
- **Points**: 8

**US-062**: En tant qu'utilisateur, je veux voir une animation de score qui monte progressivement.
- **Priorité**: Basse
- **Sprint**: 5
- **Points**: 3

**US-063**: En tant qu'utilisateur, je veux un écran de fin plus visuel avec des graphiques.
- **Priorité**: Basse
- **Sprint**: 5
- **Points**: 8

---

## 📅 Plan d'Implémentation Détaillé

### Sprint 1 (2 semaines) - Infrastructure & Base

**Objectif**: Avoir une application Laravel fonctionnelle avec une chanson de démonstration

#### Semaine 1
- [ ] **Jour 1-2**: Configuration projet Laravel + Inertia + React
  - Installer Laravel 12
  - Configurer Inertia.js
  - Configurer React + TypeScript
  - Configurer Tailwind CSS
  - Tester la stack complète

- [ ] **Jour 3-4**: Modèle de données
  - Créer migration `songs`
  - Créer migration `song_events`
  - Créer migration `practice_sessions`
  - Créer migration `practice_results`
  - Créer les modèles Eloquent
  - Définir les relations

- [ ] **Jour 5**: Factories et Seeders
  - Créer `SongFactory`
  - Créer `SongEventFactory`
  - Créer seeder avec chanson démo (Amazing Grace)
  - Tester les données

#### Semaine 2
- [ ] **Jour 6-7**: Routes et Contrôleurs
  - Créer routes API pour songs
  - Créer `SongController`
  - Créer `SongEventController`
  - Créer routes pour practice sessions
  - Créer `PracticeSessionController`

- [ ] **Jour 8-9**: Page de liste des chansons
  - Créer composant `SongList.jsx`
  - Afficher titre, BPM, durée
  - Ajouter bouton "Practice"
  - Styliser avec Tailwind

- [ ] **Jour 10**: Tests et documentation
  - Tests unitaires modèles
  - Tests API endpoints
  - Documentation API
  - README mise à jour

**Livrables Sprint 1**:
- ✅ Application Laravel fonctionnelle
- ✅ Base de données avec chanson démo
- ✅ Liste des chansons accessible
- ✅ Tests passants

---

### Sprint 2 (2 semaines) - Moteur de Temps & Animation

**Objectif**: Voir les accords avancer vers la ligne de validation

#### Semaine 1
- [ ] **Jour 1-2**: Page de pratique statique
  - Créer `PracticePage.jsx`
  - Charger les événements de la chanson
  - Afficher les accords en liste
  - Afficher BPM et durée
  - Ajouter boutons Play/Pause/Restart

- [ ] **Jour 3-4**: Moteur de temps musical
  - Créer `songScheduler.js`
  - Implémenter `play()`, `pause()`, `restart()`
  - Calculer `currentTime` avec `performance.now()`
  - Détecter l'événement actif
  - Afficher l'accord actuel

- [ ] **Jour 5**: Tests moteur de temps
  - Tester précision du timing
  - Tester pause/resume
  - Tester restart
  - Optimiser performance

#### Semaine 2
- [ ] **Jour 6-8**: Canvas et animation
  - Créer `GameCanvas.jsx`
  - Dessiner le fond et la hit line
  - Dessiner les pistes
  - Calculer position X des blocs
  - Implémenter `requestAnimationFrame`
  - Animer les blocs

- [ ] **Jour 9**: Connexion MIDI basique
  - Créer `midiService.js`
  - Demander accès MIDI
  - Lister périphériques
  - Écouter `noteOn` et `noteOff`
  - Afficher notes actives

- [ ] **Jour 10**: Tests et optimisation
  - Tester animation 60 FPS
  - Optimiser Canvas rendering
  - Tester MIDI sur différents devices
  - Documentation technique

**Livrables Sprint 2**:
- ✅ Blocs d'accords qui avancent
- ✅ Animation fluide
- ✅ Contrôles Play/Pause/Restart
- ✅ Détection MIDI basique

---

### Sprint 3 (2 semaines) - Reconnaissance & Validation

**Objectif**: Valider les accords joués et afficher le feedback

#### Semaine 1
- [ ] **Jour 1-2**: Reconnaissance d'accords
  - Créer `chordRecognizer.js`
  - Convertir notes MIDI en noms
  - Reconnaître accords majeurs
  - Reconnaître accords mineurs
  - Gérer inversions
  - Afficher accord détecté

- [ ] **Jour 3-4**: Validation temps réel
  - Créer `timingValidator.js`
  - Trouver événement attendu
  - Comparer accords
  - Calculer décalage temporel
  - Retourner statut (Perfect/Good/Early/Late/Wrong/Miss)

- [ ] **Jour 5**: Feedback visuel
  - Créer `FeedbackBadge.jsx`
  - Afficher feedback immédiat
  - Animer l'apparition
  - Gérer les couleurs par statut

#### Semaine 2
- [ ] **Jour 6-7**: Système de score
  - Créer `scoreService.js`
  - Calculer points par statut
  - Calculer accuracy
  - Calculer max streak
  - Mettre à jour en temps réel

- [ ] **Jour 8-9**: Sauvegarde des sessions
  - Créer session au démarrage
  - Stocker validations frontend
  - Envoyer résultats au backend
  - Sauvegarder en base de données
  - Créer écran de résumé

- [ ] **Jour 10**: Tests et ajustements
  - Tester reconnaissance d'accords
  - Tester validation timing
  - Ajuster fenêtres de tolérance
  - Tests end-to-end complets

**Livrables Sprint 3**:
- ✅ Reconnaissance d'accords fonctionnelle
- ✅ Validation temps réel
- ✅ Feedback immédiat
- ✅ Score et sessions sauvegardés
- ✅ MVP fonctionnel complet

---

### Sprint 4 (2 semaines) - Éditeur d'Exercices

**Objectif**: Permettre la création d'exercices personnalisés

#### Semaine 1
- [ ] **Jour 1-3**: Formulaire de création
  - Créer `SongEditor.jsx`
  - Formulaire titre, BPM, durée
  - Validation des champs
  - Sauvegarde chanson

- [ ] **Jour 4-5**: Ajout d'accords
  - Interface d'ajout d'événements
  - Sélection accord
  - Définition start_time
  - Définition duration

#### Semaine 2
- [ ] **Jour 6-7**: Timeline visuelle
  - Créer `TimelineEditor.jsx`
  - Afficher événements sur timeline
  - Drag & drop pour repositionner
  - Zoom in/out

- [ ] **Jour 8-9**: Édition et suppression
  - Modifier événements existants
  - Supprimer événements
  - Dupliquer chanson
  - Validation cohérence

- [ ] **Jour 10**: Tests et UX
  - Tests création/édition
  - Améliorer UX
  - Documentation utilisateur

**Livrables Sprint 4**:
- ✅ Éditeur d'exercices fonctionnel
- ✅ Timeline visuelle
- ✅ CRUD complet sur chansons

---

### Sprint 5 (2 semaines) - Améliorations Visuelles

**Objectif**: Rendre l'expérience plus engageante

#### Semaine 1
- [ ] **Jour 1-2**: Effets visuels feedback
  - Particules sur Perfect
  - Flash sur Perfect
  - Shake sur Wrong
  - Couleur rouge sur Wrong

- [ ] **Jour 3-4**: Couleurs et thème
  - Couleurs par accord
  - Thème sombre/clair
  - Améliorer contraste
  - Animations transitions

- [ ] **Jour 5**: Mini timeline
  - Timeline en bas de l'écran
  - Indicateur de progression
  - Événements à venir

#### Semaine 2
- [ ] **Jour 6-7**: Compteurs et animations
  - Compteur de streak
  - Animation score qui monte
  - Barre de progression
  - Effets sonores (optionnel)

- [ ] **Jour 8-9**: Écran de fin amélioré
  - Graphiques de performance
  - Comparaison avec sessions précédentes
  - Badges de réussite
  - Partage social (optionnel)

- [ ] **Jour 10**: Polish et optimisation
  - Optimiser animations
  - Tester performance
  - Corriger bugs visuels
  - Documentation

**Livrables Sprint 5**:
- ✅ Expérience visuelle engageante
- ✅ Effets visuels sur feedback
- ✅ Interface polie et fluide

---

### Sprint 6-10 (Fonctionnalités Avancées)

#### Sprint 6: Fonctionnalités Utilisateur Avancées
- Transposition de tonalité
- Ajustement BPM
- Mode boucle sur section
- Historique des sessions
- Statistiques détaillées

#### Sprint 7: Mode Professeur (Phase 1)
- Création de classes
- Gestion des élèves
- Assignation d'exercices basique

#### Sprint 8: Mode Professeur (Phase 2)
- Suivi de progression élèves
- Commentaires du professeur
- Rapports de performance

#### Sprint 9: Import/Export
- Import ChordPro
- Import MIDI
- Export sessions
- Partage d'exercices

#### Sprint 10: SaaS et Monétisation
- Plans tarifaires
- Système d'abonnement
- Limitations par plan
- Dashboard admin

---

## 🗺️ Roadmap Visuelle

```
MVP (Sprints 1-3) - 6 semaines
├── Infrastructure Laravel + React
├── Moteur de temps musical
├── Animation Canvas
├── Détection MIDI
├── Reconnaissance d'accords
└── Validation et scoring

V1.0 (Sprints 4-5) - 4 semaines
├── Éditeur d'exercices
└── Améliorations visuelles

V2.0 (Sprints 6-8) - 6 semaines
├── Fonctionnalités avancées
└── Mode professeur

V3.0 (Sprints 9-10) - 4 semaines
├── Import/Export
└── SaaS et monétisation

Future
├── Reconnaissance microphone
├── Support guitare
├── Partitions MusicXML
├── Application mobile
└── Mode multijoueur
```

---

## ✅ Critères d'Acceptation

### MVP (Fin Sprint 3)

**Critères Fonctionnels**:
- [ ] L'utilisateur peut voir une liste de chansons
- [ ] L'utilisateur peut ouvrir une chanson de pratique
- [ ] Les accords avancent vers la ligne de validation
- [ ] L'animation est fluide (60 FPS)
- [ ] L'utilisateur peut connecter un clavier MIDI
- [ ] Les notes MIDI sont détectées en temps réel
- [ ] Les accords sont reconnus correctement (majeurs et mineurs)
- [ ] Le feedback est affiché immédiatement (Perfect/Good/Early/Late/Wrong/Miss)
- [ ] Le score est calculé et affiché
- [ ] La session est sauvegardée en base de données
- [ ] Un écran de résumé est affiché à la fin

**Critères Techniques**:
- [ ] Timing précis avec `performance.now()`
- [ ] Canvas optimisé avec `requestAnimationFrame`
- [ ] Pas de re-render React excessifs
- [ ] Latence MIDI < 50ms
- [ ] Tests unitaires > 80% coverage
- [ ] Documentation API complète
- [ ] Code TypeScript sans erreurs

**Critères UX**:
- [ ] Interface intuitive et claire
- [ ] Feedback visuel immédiat
- [ ] Pas de lag perceptible
- [ ] Messages d'erreur clairs
- [ ] Responsive design (desktop prioritaire)

---

## 📊 Métriques de Succès

### Métriques Techniques
- **Performance**: Animation à 60 FPS constant
- **Précision**: Timing ±50ms pour Perfect
- **Latence MIDI**: < 50ms
- **Temps de chargement**: < 2s
- **Taux d'erreur**: < 1%

### Métriques Utilisateur
- **Taux de complétion**: > 70% des sessions terminées
- **Temps de pratique moyen**: > 10 minutes
- **Taux de retour**: > 50% reviennent dans les 7 jours
- **Satisfaction**: > 4/5 étoiles

### Métriques Business (Post-MVP)
- **Conversion freemium → premium**: > 5%
- **Rétention 30 jours**: > 40%
- **NPS (Net Promoter Score)**: > 50

---

## 🎯 Prochaines Étapes Immédiates

1. **Valider le plan** avec l'équipe
2. **Prioriser** les user stories si nécessaire
3. **Créer les tickets** dans votre outil de gestion (Jira, Linear, etc.)
4. **Commencer Sprint 1** avec la configuration Laravel
5. **Mettre en place** les rituels agiles (daily, retro, planning)

---

## 📝 Notes Importantes

### Décisions Techniques Clés
- **Pourquoi MIDI d'abord?** Plus simple et précis que le microphone
- **Pourquoi Canvas?** Performance supérieure pour l'animation
- **Pourquoi TypeScript?** Meilleure maintenabilité à long terme
- **Pourquoi Inertia?** Simplicité du monolithe avec réactivité SPA

### Risques Identifiés
1. **Timing imprécis** → Utiliser `performance.now()` et `requestAnimationFrame`
2. **Latence MIDI** → Ajouter calibration utilisateur
3. **Re-renders React** → Utiliser refs et Canvas direct
4. **Reconnaissance stricte** → Comparer classes de notes, pas ordre exact

### Évolutions Futures
- Reconnaissance microphone (complexe)
- Support guitare avec tablatures
- Import MusicXML pour partitions classiques
- Application mobile native
- Mode multijoueur en temps réel
- Intelligence artificielle pour feedback personnalisé

---

**Document créé le**: 2026-05-12  
**Version**: 1.0  
**Auteur**: Bob (AI Assistant)  
**Basé sur**: plan_application_musique_interactive_yousician.md
