# Plan détaillé — Application de pratique musicale interactive type Yousician

## 1. Vision générale du projet

L’objectif est de créer une application web interactive capable d’afficher des notes, accords ou partitions sous forme dynamique, avec une progression visuelle en temps réel, comme dans un jeu musical. L’utilisateur voit les accords ou notes arriver vers une zone de validation, joue au bon moment, puis l’application évalue si ce qui a été joué est correct, incorrect, trop tôt, trop tard ou parfaitement synchronisé.

L’application doit pouvoir évoluer progressivement. La première version ne doit pas chercher à reproduire toute la complexité de Yousician. Elle doit d’abord prouver le concept avec un système fiable, simple et extensible.

La première cible recommandée est :

> Une application web Laravel + Inertia + React qui affiche des blocs d’accords en mouvement et valide les accords joués à l’aide d’un clavier MIDI.

Ensuite, l’application pourra évoluer vers :

- la reconnaissance au microphone ;
- la guitare ;
- les partitions MusicXML ;
- les tablatures ;
- les exercices personnalisés ;
- le scoring avancé ;
- les parcours d’apprentissage ;
- un mode professeur/élève ;
- une version SaaS.

---

## 2. Concept fonctionnel

L’utilisateur ouvre une chanson ou un exercice. L’écran affiche une piste musicale horizontale ou verticale. Des blocs représentant les accords arrivent progressivement vers une ligne de validation appelée `hit line`.

Quand un bloc atteint la ligne de validation, l’utilisateur doit jouer l’accord demandé. L’application écoute les notes jouées via MIDI ou, plus tard, via le microphone.

L’application compare ensuite :

- l’accord attendu ;
- l’accord réellement joué ;
- le moment où il a été joué ;
- la durée pendant laquelle il a été tenu ;
- la précision rythmique.

Elle affiche immédiatement un retour visuel :

- `Perfect` ;
- `Good` ;
- `Early` ;
- `Late` ;
- `Wrong` ;
- `Miss`.

Exemple simple :

```text
Accord attendu : D
Moment attendu : 4.000 secondes
Accord joué : D
Moment joué : 4.080 secondes
Décalage : +80 ms
Résultat : Perfect
```

---

## 3. Public cible

### 3.1 Débutants en musique

L’application peut aider les débutants à apprendre les accords de base, à comprendre le rythme et à développer leur régularité.

### 3.2 Guitaristes

À terme, l’application pourrait afficher des accords, des tablatures, des positions de doigts et reconnaître les accords joués à la guitare.

### 3.3 Pianistes

Le mode MIDI est très adapté au piano. L’utilisateur branche un clavier MIDI et l’application détecte précisément les notes jouées.

### 3.4 Professeurs de musique

Une version avancée pourrait permettre aux professeurs de créer des exercices, d’assigner des chansons et de suivre la progression des élèves.

### 3.5 Groupes de louange / église

L’application pourrait aussi être très utile pour apprendre des progressions d’accords, répéter des chants, transposer automatiquement et préparer les musiciens.

---

## 4. Objectif du MVP

Le MVP doit être simple, fiable et démontrable.

### 4.1 Objectif principal du MVP

Créer une page de pratique musicale où :

1. une chanson de démonstration est chargée ;
2. des blocs d’accords avancent vers une ligne de validation ;
3. l’utilisateur peut démarrer, mettre en pause et recommencer ;
4. l’utilisateur peut brancher un clavier MIDI ;
5. l’application détecte les notes MIDI jouées ;
6. l’application reconnaît l’accord joué ;
7. l’application valide si l’accord est correct ou non ;
8. l’application affiche un score et un feedback immédiat.

### 4.2 Ce que le MVP ne doit pas faire au début

Pour éviter de complexifier trop tôt, le MVP ne doit pas encore inclure :

- la reconnaissance micro ;
- l’import PDF ;
- l’import image ;
- la lecture audio complète ;
- la reconnaissance avancée d’accords guitare ;
- la gestion complète des professeurs ;
- les abonnements ;
- les parcours d’apprentissage complexes ;
- les partitions classiques complètes.

Ces éléments doivent être prévus dans l’architecture, mais pas développés dans la première version.

---

## 5. Stack technique recommandée

### 5.1 Backend

- Laravel 12
- MySQL ou PostgreSQL
- Laravel Sanctum si API externe nécessaire
- Laravel Policies pour les permissions
- Laravel Queues plus tard pour les imports lourds
- Laravel Storage pour fichiers MusicXML, MIDI, audio ou images

### 5.2 Frontend

- React
- Inertia.js
- TypeScript recommandé, mais JavaScript possible au début
- Canvas HTML5 ou PixiJS pour le rendu du jeu
- Tailwind CSS pour l’interface
- Framer Motion pour certains effets UI non critiques

### 5.3 Audio et musique

- Web MIDI API pour le MVP
- Web Audio API pour la reconnaissance micro plus tard
- Tone.js pour le timing musical et éventuellement le métronome
- Tonal.js pour la reconnaissance des notes, accords et transpositions
- OpenSheetMusicDisplay pour les partitions MusicXML plus tard
- VexFlow pour affichage musical plus personnalisé

---

## 6. Architecture globale

L’application sera divisée en plusieurs couches.

### 6.1 Couche Laravel

Laravel gère :

- les utilisateurs ;
- les chansons ;
- les événements musicaux ;
- les sessions de pratique ;
- les résultats ;
- la progression ;
- les fichiers importés ;
- les permissions ;
- les tableaux de bord.

### 6.2 Couche React

React gère :

- l’écran de pratique ;
- les contrôles de lecture ;
- l’état du jeu ;
- l’animation ;
- le score ;
- le feedback visuel ;
- la connexion MIDI ;
- la reconnaissance d’accords côté client ;
- la validation en temps réel.

### 6.3 Couche musicale

Cette couche contient la logique métier musicale :

- calcul du temps courant ;
- positionnement des blocs ;
- détection des événements actifs ;
- reconnaissance des notes ;
- reconnaissance des accords ;
- comparaison avec les accords attendus ;
- calcul du score ;
- gestion du timing.

---

## 7. Modèle de données

### 7.1 Table `songs`

Cette table représente une chanson, un exercice ou une progression d’accords.

Champs recommandés :

```text
id
user_id nullable
title
artist nullable
bpm integer default 90
time_signature string default "4/4"
key_signature string nullable
difficulty string nullable
source_type string nullable
source_file_path string nullable
metadata json nullable
created_at
updated_at
```

Rôle des champs :

- `title` : nom de la chanson ou exercice ;
- `artist` : artiste ou source ;
- `bpm` : tempo ;
- `time_signature` : signature rythmique ;
- `key_signature` : tonalité ;
- `difficulty` : niveau ;
- `source_type` : manuel, MIDI, MusicXML, ChordPro, etc. ;
- `metadata` : informations supplémentaires.

---

### 7.2 Table `song_events`

Cette table représente les éléments musicaux à jouer : accords, notes, silences, mesures, paroles ou indications.

Champs recommandés :

```text
id
song_id
type string
value string nullable
start_time decimal(10, 3)
duration decimal(10, 3)
beat_position decimal nullable
measure_number integer nullable
lane string nullable
metadata json nullable
created_at
updated_at
```

Exemple d’événement accord :

```json
{
  "type": "chord",
  "value": "D",
  "start_time": 2.000,
  "duration": 1.500,
  "lane": "guitar",
  "metadata": {
    "fingering": "xx0232",
    "color": "blue"
  }
}
```

Exemple d’événement note :

```json
{
  "type": "note",
  "value": "C4",
  "start_time": 3.500,
  "duration": 0.500,
  "lane": "piano",
  "metadata": {
    "midi_note": 60,
    "velocity": 90
  }
}
```

---

### 7.3 Table `practice_sessions`

Cette table représente une session de pratique d’un utilisateur sur une chanson.

Champs recommandés :

```text
id
user_id nullable
song_id
score integer default 0
accuracy decimal nullable
max_streak integer default 0
total_events integer default 0
correct_events integer default 0
started_at timestamp nullable
finished_at timestamp nullable
metadata json nullable
created_at
updated_at
```

---

### 7.4 Table `practice_results`

Cette table représente le résultat d’un événement joué par l’utilisateur.

Champs recommandés :

```text
id
practice_session_id
song_event_id nullable
expected_value string
played_value string nullable
status string
timing_offset_ms integer nullable
score integer default 0
metadata json nullable
created_at
updated_at
```

Exemple :

```json
{
  "expected_value": "D",
  "played_value": "D",
  "status": "perfect",
  "timing_offset_ms": 82,
  "score": 100
}
```

---

## 8. États de validation

### 8.1 `Perfect`

L’utilisateur joue le bon accord dans une fenêtre de précision très courte.

Recommandation :

```text
-100 ms à +100 ms
```

Score suggéré :

```text
100 points
```

---

### 8.2 `Good`

L’utilisateur joue le bon accord avec un léger décalage acceptable.

Recommandation :

```text
-250 ms à +250 ms
```

Score suggéré :

```text
70 points
```

---

### 8.3 `Early`

L’utilisateur joue le bon accord, mais trop tôt.

Exemple :

```text
Accord attendu à 4.000 s
Accord joué à 3.600 s
Décalage : -400 ms
```

Score suggéré :

```text
30 points
```

---

### 8.4 `Late`

L’utilisateur joue le bon accord, mais trop tard.

Exemple :

```text
Accord attendu à 4.000 s
Accord joué à 4.450 s
Décalage : +450 ms
```

Score suggéré :

```text
30 points
```

---

### 8.5 `Wrong`

L’utilisateur joue un accord différent de celui attendu.

Exemple :

```text
Accord attendu : D
Accord joué : G
```

Score suggéré :

```text
0 point
```

---

### 8.6 `Miss`

L’utilisateur ne joue rien dans la fenêtre de validation.

Score suggéré :

```text
0 point
```

---

## 9. Logique de timing

### 9.1 Temps courant

Le temps courant ne doit pas dépendre uniquement de `setInterval`, car ce n’est pas assez précis pour un jeu musical.

La première version peut utiliser :

```text
performance.now()
```

Le moteur doit stocker :

- le moment où la lecture commence ;
- le temps écoulé ;
- le temps au moment de la pause ;
- le temps de reprise.

### 9.2 Calcul du temps courant

Formule simple :

```text
currentTime = (performance.now() - startedAt) / 1000
```

Si l’utilisateur met en pause :

```text
pausedAt = currentTime
```

Quand il reprend :

```text
startedAt = performance.now() - pausedAt * 1000
```

---

## 10. Logique de positionnement visuel

Chaque événement musical doit être converti en position à l’écran.

Exemple horizontal :

```text
hitLineX = 220 pixels
pixelsPerSecond = 180
x = hitLineX + (event.startTime - currentTime) * pixelsPerSecond
```

Si `event.startTime` est dans le futur, le bloc est à droite de la ligne.

Si `event.startTime` est maintenant, le bloc est sur la ligne.

Si `event.startTime` est passé, le bloc est à gauche de la ligne.

---

## 11. Rendu visuel

### 11.1 Canvas recommandé

Pour l’effet type jeu, le rendu doit être fluide. Canvas est recommandé pour le MVP.

Le Canvas doit dessiner :

- le fond ;
- les lignes de piste ;
- la ligne de validation ;
- les blocs d’accords ;
- les labels d’accords ;
- les feedbacks ;
- la mini timeline ;
- les effets visuels de succès ou erreur.

### 11.2 Structure visuelle de base

```text
----------------------------------------------------
Score: 1500       Streak: 8       Accuracy: 92%
----------------------------------------------------

              D          E          A
          [-------]  [-------]  [-------]

================ HIT LINE ==========================

Feedback: Perfect

----------------------------------------------------
Timeline miniature
----------------------------------------------------
```

---

## 12. Détection MIDI

### 12.1 Pourquoi commencer par MIDI

Le MIDI est le meilleur choix pour le MVP parce qu’il donne des informations exactes :

- note jouée ;
- vélocité ;
- moment ;
- note relâchée ;
- canal ;
- périphérique.

Avec le MIDI, l’application ne doit pas deviner la note. Elle la reçoit directement.

### 12.2 Données MIDI utiles

Un message MIDI contient généralement :

```text
command
note
velocity
```

Exemple :

```text
144, 60, 100
```

Cela signifie souvent :

```text
Note On, C4, vélocité 100
```

---

## 13. Reconnaissance d’accords MIDI

### 13.1 Conversion note MIDI vers nom de note

Exemples :

```text
60 = C4
61 = C#4
62 = D4
63 = D#4
64 = E4
65 = F4
66 = F#4
67 = G4
68 = G#4
69 = A4
70 = A#4
71 = B4
```

### 13.2 Reconnaissance d’un accord majeur

Un accord majeur est composé de :

```text
fondamentale + tierce majeure + quinte juste
```

Exemple D majeur :

```text
D + F# + A
```

### 13.3 Reconnaissance d’un accord mineur

Un accord mineur est composé de :

```text
fondamentale + tierce mineure + quinte juste
```

Exemple A mineur :

```text
A + C + E
```

### 13.4 Tolérance recommandée

Il ne faut pas exiger que les notes soient dans une octave précise. Il faut comparer les classes de notes.

Exemple :

```text
C3 + E3 + G3
```

et

```text
C4 + E4 + G4
```

sont tous les deux un accord de C majeur.

---

## 14. Validation d’un accord joué

La validation doit suivre ce processus :

1. récupérer les notes actives ;
2. convertir les notes MIDI en noms de notes ;
3. reconnaître l’accord joué ;
4. trouver l’événement attendu le plus proche du temps courant ;
5. comparer l’accord attendu et l’accord joué ;
6. calculer le décalage de timing ;
7. déterminer le statut ;
8. afficher le feedback ;
9. mettre à jour le score ;
10. enregistrer le résultat.

---

## 15. Services frontend recommandés

### 15.1 `midiService.js`

Responsabilités :

- demander l’accès MIDI ;
- détecter les périphériques ;
- écouter les messages MIDI ;
- gérer les notes actives ;
- émettre des événements `noteOn` et `noteOff`.

### 15.2 `chordRecognizer.js`

Responsabilités :

- convertir des notes MIDI en noms de notes ;
- normaliser les notes par classe ;
- reconnaître les accords majeurs ;
- reconnaître les accords mineurs ;
- retourner le nom de l’accord détecté.

### 15.3 `timingValidator.js`

Responsabilités :

- comparer accord attendu et accord joué ;
- calculer le timing offset ;
- déterminer `perfect`, `good`, `early`, `late`, `wrong`, `miss` ;
- retourner le score associé.

### 15.4 `songScheduler.js`

Responsabilités :

- calculer le temps courant ;
- gérer play/pause/restart ;
- trouver les événements actifs ;
- trouver les événements proches de la hit line ;
- déterminer les événements expirés non joués.

### 15.5 `scoreService.js`

Responsabilités :

- calculer le score total ;
- calculer le streak ;
- calculer l’accuracy ;
- calculer le max streak ;
- préparer les données pour sauvegarde.

---

## 16. Composants React recommandés

### 16.1 `PracticePage.jsx`

Page principale Inertia.

Responsabilités :

- recevoir la chanson depuis Laravel ;
- initialiser la session ;
- afficher le jeu ;
- gérer la sauvegarde finale.

### 16.2 `PracticeGame.jsx`

Composant central du jeu.

Responsabilités :

- orchestrer le scheduler ;
- connecter le MIDI ;
- gérer la validation ;
- mettre à jour le score ;
- transmettre les données au Canvas.

### 16.3 `GameCanvas.jsx`

Responsabilités :

- dessiner les blocs ;
- dessiner les pistes ;
- dessiner la hit line ;
- animer via `requestAnimationFrame` ;
- afficher les effets visuels.

### 16.4 `ScoreBoard.jsx`

Responsabilités :

- afficher le score ;
- afficher le streak ;
- afficher l’accuracy.

### 16.5 `FeedbackBadge.jsx`

Responsabilités :

- afficher `Perfect`, `Good`, `Early`, `Late`, `Wrong`, `Miss` ;
- gérer une petite animation d’apparition/disparition.

### 16.6 `TransportControls.jsx`

Responsabilités :

- bouton Play ;
- bouton Pause ;
- bouton Restart ;
- changement de vitesse plus tard.

### 16.7 `MidiStatus.jsx`

Responsabilités :

- afficher si MIDI est disponible ;
- afficher le périphérique connecté ;
- afficher les notes actives ;
- permettre de reconnecter le périphérique.

---

## 17. Routes Laravel recommandées

### 17.1 Chansons

```text
GET /music-practice/songs
GET /music-practice/songs/create
POST /music-practice/songs
GET /music-practice/songs/{song}
GET /music-practice/songs/{song}/edit
PUT /music-practice/songs/{song}
DELETE /music-practice/songs/{song}
```

### 17.2 Événements musicaux

```text
POST /music-practice/songs/{song}/events
PUT /music-practice/songs/{song}/events/{songEvent}
DELETE /music-practice/songs/{song}/events/{songEvent}
```

### 17.3 Pratique

```text
GET /music-practice/songs/{song}/practice
POST /music-practice/sessions
POST /music-practice/sessions/{practiceSession}/results
PUT /music-practice/sessions/{practiceSession}/finish
```

---

## 18. Contrôleurs Laravel recommandés

### 18.1 `SongController`

Responsabilités :

- lister les chansons ;
- créer une chanson ;
- modifier une chanson ;
- supprimer une chanson ;
- afficher les détails.

### 18.2 `SongEventController`

Responsabilités :

- ajouter un accord ou une note ;
- modifier un événement ;
- supprimer un événement ;
- réordonner les événements plus tard.

### 18.3 `PracticeController`

Responsabilités :

- afficher l’écran de pratique ;
- fournir les événements au frontend.

### 18.4 `PracticeSessionController`

Responsabilités :

- créer une session ;
- enregistrer les résultats ;
- terminer une session ;
- calculer le résumé final.

---

## 19. Étapes de développement recommandées

## Phase 1 — Base Laravel

Objectif : préparer le socle backend.

Tâches :

1. créer le projet Laravel ;
2. installer Inertia + React ;
3. configurer Tailwind ;
4. créer les migrations ;
5. créer les modèles ;
6. créer les factories ;
7. créer un seeder avec une chanson de démonstration ;
8. créer les routes ;
9. créer les contrôleurs ;
10. afficher une liste simple des chansons.

Livrable :

```text
Une application Laravel fonctionnelle avec une chanson démo en base de données.
```

---

## Phase 2 — Page de pratique statique

Objectif : afficher une chanson et ses accords.

Tâches :

1. créer la page `PracticePage.jsx` ;
2. charger les événements de la chanson ;
3. afficher les accords en liste ;
4. afficher le BPM ;
5. afficher la durée totale ;
6. ajouter les boutons Play/Pause/Restart sans animation avancée.

Livrable :

```text
Une page de pratique qui affiche les accords de la chanson.
```

---

## Phase 3 — Moteur de temps

Objectif : créer le scheduler musical.

Tâches :

1. créer `songScheduler.js` ;
2. implémenter `play()` ;
3. implémenter `pause()` ;
4. implémenter `restart()` ;
5. calculer `currentTime` ;
6. détecter l’événement actif ;
7. afficher l’accord actuel dans l’interface.

Livrable :

```text
Quand l’utilisateur clique sur Play, l’accord actif change automatiquement selon le temps.
```

---

## Phase 4 — Animation Canvas

Objectif : afficher les blocs qui avancent vers la hit line.

Tâches :

1. créer `GameCanvas.jsx` ;
2. dessiner le fond ;
3. dessiner la hit line ;
4. dessiner les pistes ;
5. dessiner les blocs ;
6. calculer la position X des blocs ;
7. animer avec `requestAnimationFrame` ;
8. supprimer visuellement les blocs passés.

Livrable :

```text
Les blocs d’accords avancent de manière fluide vers la ligne de validation.
```

---

## Phase 5 — Connexion MIDI

Objectif : détecter les notes jouées par l’utilisateur.

Tâches :

1. créer `midiService.js` ;
2. demander l’accès MIDI ;
3. lister les périphériques ;
4. écouter `noteOn` ;
5. écouter `noteOff` ;
6. maintenir la liste des notes actives ;
7. afficher les notes actives dans `MidiStatus.jsx`.

Livrable :

```text
Quand l’utilisateur joue sur un clavier MIDI, les notes actives apparaissent dans l’application.
```

---

## Phase 6 — Reconnaissance d’accords

Objectif : transformer les notes MIDI en accord.

Tâches :

1. créer `chordRecognizer.js` ;
2. convertir les notes MIDI en classes de notes ;
3. reconnaître accords majeurs ;
4. reconnaître accords mineurs ;
5. gérer les inversions ;
6. afficher l’accord détecté.

Livrable :

```text
Quand l’utilisateur joue D-F#-A, l’application affiche D.
```

---

## Phase 7 — Validation temps réel

Objectif : comparer l’accord joué avec l’accord attendu.

Tâches :

1. créer `timingValidator.js` ;
2. trouver l’événement attendu le plus proche ;
3. comparer `expectedChord` avec `playedChord` ;
4. calculer le décalage en millisecondes ;
5. retourner le statut ;
6. afficher le feedback ;
7. mettre à jour le score ;
8. gérer les événements déjà validés.

Livrable :

```text
L’application affiche Perfect, Good, Early, Late, Wrong ou Miss selon la performance.
```

---

## Phase 8 — Score et session

Objectif : enregistrer la progression.

Tâches :

1. créer une session au démarrage ;
2. stocker les validations côté frontend ;
3. envoyer les résultats au backend ;
4. calculer le score final ;
5. calculer l’accuracy ;
6. calculer le max streak ;
7. afficher l’écran de résumé.

Livrable :

```text
À la fin de l’exercice, l’utilisateur voit son score, son accuracy et ses erreurs.
```

---

## Phase 9 — Éditeur d’exercices simple

Objectif : permettre de créer ses propres progressions.

Tâches :

1. formulaire de création de chanson ;
2. ajout manuel d’accords ;
3. définition de `start_time` ;
4. définition de `duration` ;
5. aperçu de la timeline ;
6. sauvegarde des événements.

Livrable :

```text
L’utilisateur peut créer une progression d’accords et la pratiquer.
```

---

## Phase 10 — Améliorations visuelles

Objectif : rendre l’expérience plus proche d’un jeu.

Tâches :

1. effets visuels sur Perfect ;
2. effets visuels sur Wrong ;
3. couleurs par accord ;
4. mini timeline en bas ;
5. compteur de streak ;
6. animation de score ;
7. écran de fin plus visuel.

Livrable :

```text
L’expérience devient engageante, fluide et motivante.
```

---

## 20. Seed de démonstration recommandé

Chanson :

```text
Beginner Chord Practice
```

BPM :

```text
90
```

Événements :

```text
D à 2s, durée 1.5s
E à 4s, durée 1.5s
A à 6s, durée 1.5s
D à 8s, durée 1.5s
G à 10s, durée 1.5s
A à 12s, durée 1.5s
```

---

## 21. Règles de scoring recommandées

```text
Perfect : 100 points
Good    : 70 points
Early   : 30 points
Late    : 30 points
Wrong   : 0 point
Miss    : 0 point
```

Bonus streak :

```text
5 bonnes réponses d’affilée  : +50
10 bonnes réponses d’affilée : +150
20 bonnes réponses d’affilée : +400
```

Accuracy :

```text
accuracy = correct_events / total_events * 100
```

---

## 22. Gestion des erreurs et cas spéciaux

### 22.1 Aucun périphérique MIDI

Afficher :

```text
Aucun périphérique MIDI détecté. Branche un clavier MIDI ou continue en mode démonstration.
```

### 22.2 Navigateur incompatible

Afficher :

```text
Ton navigateur ne supporte pas la Web MIDI API. Essaie avec Chrome ou Edge.
```

### 22.3 Accord inconnu

Si les notes ne correspondent à aucun accord simple :

```text
Unknown chord
```

### 22.4 Plusieurs accords joués rapidement

Le moteur doit éviter de valider plusieurs fois le même événement.

Solution :

```text
Chaque song_event reçoit un état local : pending, hit, missed.
```

---

## 23. Évolution vers le microphone

La reconnaissance micro viendra plus tard.

Étapes recommandées :

1. capturer le son avec Web Audio API ;
2. analyser la fréquence dominante ;
3. détecter une note simple ;
4. valider une mélodie simple ;
5. détecter plusieurs fréquences ;
6. reconnaître des accords approximatifs ;
7. ajouter une phase de calibration ;
8. gérer le bruit ambiant ;
9. ajouter une tolérance intelligente.

La guitare au microphone est complexe, car un accord contient plusieurs notes, des harmoniques, des bruits de cordes et des variations selon la position des doigts.

---

## 24. Évolution vers MusicXML

MusicXML permettra d’importer de vraies partitions.

Étapes :

1. upload du fichier MusicXML ;
2. stockage dans Laravel ;
3. parsing côté frontend ou backend ;
4. extraction des mesures ;
5. extraction des notes ;
6. extraction des accords ;
7. conversion en `song_events` ;
8. affichage avec OpenSheetMusicDisplay ;
9. synchronisation avec la hit line.

---

## 25. Évolution vers ChordPro

ChordPro est idéal pour les paroles avec accords.

Exemple :

```text
[C]Amazing [G]grace
How [Am]sweet the [F]sound
```

L’application pourrait convertir ça en :

```json
[
  { "type": "chord", "value": "C", "start_time": 0 },
  { "type": "chord", "value": "G", "start_time": 2 },
  { "type": "chord", "value": "Am", "start_time": 4 },
  { "type": "chord", "value": "F", "start_time": 6 }
]
```

---

## 26. Vision SaaS long terme

### 26.1 Plan gratuit

- quelques exercices ;
- progression limitée ;
- mode MIDI basique ;
- création limitée de chansons.

### 26.2 Plan premium

- chansons illimitées ;
- import MIDI ;
- import MusicXML ;
- statistiques avancées ;
- exercices personnalisés ;
- transposition ;
- mode boucle.

### 26.3 Plan professeur

- création de classes ;
- gestion des élèves ;
- assignation d’exercices ;
- suivi de progression ;
- commentaires du professeur.

---

## 27. Priorités recommandées

L’ordre recommandé est :

1. modèle de données ;
2. seed de démonstration ;
3. page de pratique ;
4. moteur de temps ;
5. animation Canvas ;
6. connexion MIDI ;
7. reconnaissance d’accord ;
8. validation ;
9. score ;
10. sauvegarde ;
11. éditeur d’exercices ;
12. design avancé.

---

## 28. Risques techniques

### 28.1 Timing imprécis

Le timing est critique. Il faut éviter de dépendre uniquement de React state pour l’animation.

Solution : utiliser `requestAnimationFrame` et `performance.now()`.

### 28.2 Latence MIDI

Le MIDI est généralement fiable, mais il peut y avoir une légère latence selon le périphérique.

Solution : ajouter une option de calibration plus tard.

### 28.3 Trop de re-render React

Si le Canvas dépend trop du state React, l’animation peut devenir lente.

Solution : utiliser des refs et dessiner directement dans Canvas.

### 28.4 Reconnaissance d’accord trop stricte

Un utilisateur peut jouer les notes dans une inversion.

Solution : comparer les classes de notes, pas l’ordre exact.

### 28.5 Reconnaissance micro difficile

Le micro est un gros sujet.

Solution : ne pas commencer par le micro.

---

## 29. Résultat attendu à la fin du MVP

À la fin du MVP, l’application doit permettre de faire ceci :

1. ouvrir une chanson de démonstration ;
2. cliquer sur Play ;
3. voir les accords avancer ;
4. brancher un clavier MIDI ;
5. jouer les accords au bon moment ;
6. recevoir un feedback immédiat ;
7. voir le score évoluer ;
8. terminer l’exercice ;
9. consulter un résumé de performance.

---

## 30. Prompt de développement initial pour Codex

```text
Create a Laravel 12 + Inertia.js + React module for an interactive music practice game inspired by Yousician.

The first version must validate chords played through the Web MIDI API. Do not implement microphone recognition yet.

Use Laravel for songs, song events, practice sessions, and practice results. Use React for the game screen. Use HTML Canvas for the moving chord blocks. Use performance.now() and requestAnimationFrame for accurate timing.

Code comments must be written in English.

Backend requirements:
- Create models: Song, SongEvent, PracticeSession, PracticeResult.
- Create migrations for all models.
- Create relationships between models.
- Create a seeder with one demo song named "Beginner Chord Practice".
- Add events: D at 2s, E at 4s, A at 6s, D at 8s, G at 10s, A at 12s.
- Create routes for listing songs, showing practice page, creating sessions, storing results, and finishing sessions.

Frontend requirements:
- Create a practice page with a Canvas-based game area.
- Display chord blocks moving toward a hit line.
- Add Play, Pause, Restart controls.
- Add Score, Streak, Accuracy display.
- Add MIDI status component.
- Detect MIDI note on/off events.
- Recognize major and minor chords from active MIDI notes.
- Validate played chords against expected events.
- Show feedback: Perfect, Good, Early, Late, Wrong, Miss.

Validation rules:
- Perfect: correct chord within 100ms.
- Good: correct chord within 250ms.
- Early: correct chord played more than 250ms before expected time.
- Late: correct chord played more than 250ms after expected time.
- Wrong: incorrect chord.
- Miss: no chord played before the event validation window closes.

Architecture requirements:
- Keep React components small and reusable.
- Put music logic in separate JS services.
- Avoid putting all game logic directly inside the page component.
- Use clear names and keep the code easy to test.
```

---

## 31. Décision technique recommandée

La meilleure première version est :

> Un jeu d’accords dynamique avec validation MIDI.

Ce choix est stratégique parce qu’il permet d’obtenir rapidement une application impressionnante, testable, stable et extensible.

Le microphone viendra plus tard, quand le moteur de jeu, le timing, la validation et le scoring seront déjà solides.

