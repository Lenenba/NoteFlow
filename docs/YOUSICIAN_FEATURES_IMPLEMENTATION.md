# 🎸 Guide d'implémentation des fonctionnalités Yousician

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Phase 1 : Indicateurs de doigts](#phase-1--indicateurs-de-doigts)
3. [Phase 2 : Multiplicateur de score](#phase-2--multiplicateur-de-score)
4. [Phase 3 : Effets visuels avancés](#phase-3--effets-visuels-avancés)
5. [Phase 4 : Main animée](#phase-4--main-animée)

---

## Vue d'ensemble

Ce document décrit l'implémentation des fonctionnalités inspirées de Yousician pour améliorer l'expérience utilisateur de NoteFlow.

### Fonctionnalités à implémenter

- ✅ **Déjà fait** : Cordes de guitare, notes colorées, ligne de hit, barre de progression
- 🎯 **À faire** : Indicateurs de doigts, multiplicateur de score, trajet pointillé, main animée

---

## Phase 1 : Indicateurs de doigts

### 1.1 Mise à jour des types TypeScript

**Fichier** : `resources/js/types/music.ts`

```typescript
// Ajouter après l'interface SongEvent existante
export interface FingerPosition {
    finger: number; // 0=thumb, 1=index, 2=middle, 3=ring, 4=pinky
    string: number; // 0-5 (E, A, D, G, B, e)
    fret: number;   // 0-24
}

// Modifier l'interface SongEvent pour ajouter le doigté
export interface SongEvent {
    id: number;
    song_id: number;
    event_type: 'note' | 'chord' | 'rest';
    start_time: number;
    duration: number;
    note_value?: string;
    chord_name?: string;
    track?: number;
    velocity?: number;
    finger?: number; // NOUVEAU : Doigt à utiliser (0-4)
    finger_positions?: FingerPosition[]; // NOUVEAU : Pour les accords
    created_at?: string;
    updated_at?: string;
}
```

### 1.2 Constantes de couleurs

**Fichier** : `resources/js/components/GuitarCanvas.tsx`

Ajouter au début du fichier, après les imports :

```typescript
// Couleurs des doigts (standard guitare)
const FINGER_COLORS: Record<number, string> = {
    0: '#808080', // Pouce (gris)
    1: '#E67E22', // Index (orange)
    2: '#9B59B6', // Majeur (violet)
    3: '#3498DB', // Annulaire (bleu)
    4: '#E74C3C', // Auriculaire (rouge)
};

// Noms des doigts pour l'accessibilité
const FINGER_NAMES: Record<number, string> = {
    0: 'P', // Pouce (Thumb)
    1: 'i', // Index
    2: 'm', // Majeur (Middle)
    3: 'a', // Annulaire (Annular)
    4: 'c', // Auriculaire (Chico/pinky)
};
```

### 1.3 Fonction de dessin des indicateurs

**Fichier** : `resources/js/components/GuitarCanvas.tsx`

Ajouter cette fonction avant le `useEffect` principal :

```typescript
const drawFingerIndicators = (
    ctx: CanvasRenderingContext2D,
    events: SongEvent[],
    currentTime: number
): void => {
    const numStrings = 6;
    const stringSpacing = (CANVAS_HEIGHT - 100) / (numStrings + 1);
    const startY = 50;
    const indicatorX = 40; // Position X des indicateurs (à gauche)
    const lookAheadTime = 2; // Secondes à l'avance

    // Pour chaque corde
    for (let stringIndex = 0; stringIndex < numStrings; stringIndex++) {
        const stringY = startY + (stringIndex + 1) * stringSpacing;

        // Trouver la prochaine note sur cette corde
        const upcomingNotes = events.filter(
            (e) =>
                e.track === stringIndex &&
                e.start_time > currentTime &&
                e.start_time < currentTime + lookAheadTime
        );

        if (upcomingNotes.length > 0) {
            const nextNote = upcomingNotes[0];
            const finger = nextNote.finger ?? 0;
            const fingerColor = FINGER_COLORS[finger];
            const fingerName = FINGER_NAMES[finger];

            // Calculer l'opacité basée sur la proximité
            const timeUntilNote = nextNote.start_time - currentTime;
            const opacity = Math.max(0.3, 1 - timeUntilNote / lookAheadTime);

            // Cercle de fond
            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.fillStyle = fingerColor;
            ctx.beginPath();
            ctx.arc(indicatorX, stringY, 18, 0, Math.PI * 2);
            ctx.fill();

            // Bordure blanche
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Numéro/lettre du doigt
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(fingerName, indicatorX, stringY);

            // Animation de pulsation si très proche
            if (timeUntilNote < 0.5) {
                const pulseScale = 1 + Math.sin(Date.now() / 100) * 0.2;
                ctx.beginPath();
                ctx.arc(indicatorX, stringY, 18 * pulseScale, 0, Math.PI * 2);
                ctx.strokeStyle = fingerColor;
                ctx.lineWidth = 3;
                ctx.globalAlpha = opacity * 0.5;
                ctx.stroke();
            }

            ctx.restore();
        } else {
            // Afficher un cercle gris vide si pas de note à venir
            ctx.save();
            ctx.globalAlpha = 0.2;
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(indicatorX, stringY, 18, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }

    // Légende en haut
    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Doigts', indicatorX, 25);
    ctx.restore();
};
```

### 1.4 Intégration dans le rendu

**Fichier** : `resources/js/components/GuitarCanvas.tsx`

Dans la fonction `draw()`, ajouter après `drawProgressBar()` :

```typescript
const draw = () => {
    // ... code existant ...
    
    drawProgressBar(ctx);
    
    // NOUVEAU : Dessiner les indicateurs de doigts
    drawFingerIndicators(ctx, events, currentTime);
    
    animationFrameId = requestAnimationFrame(draw);
};
```

### 1.5 Migration de base de données

**Fichier** : `database/migrations/2026_05_12_140000_add_finger_to_song_events.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('song_events', function (Blueprint $table) {
            $table->tinyInteger('finger')->nullable()->after('velocity')
                ->comment('Finger to use: 0=thumb, 1=index, 2=middle, 3=ring, 4=pinky');
            $table->json('finger_positions')->nullable()->after('finger')
                ->comment('Array of finger positions for chords');
        });
    }

    public function down(): void
    {
        Schema::table('song_events', function (Blueprint $table) {
            $table->dropColumn(['finger', 'finger_positions']);
        });
    }
};
```

Exécuter la migration :

```bash
php artisan migrate
```

---

## Phase 2 : Multiplicateur de score

### 2.1 État du multiplicateur

**Fichier** : `resources/js/pages/Practice/Show.tsx`

Ajouter dans les états du composant :

```typescript
const [scoreMultiplier, setScoreMultiplier] = useState(1);
const [streak, setStreak] = useState(0);
const [maxStreak, setMaxStreak] = useState(0);
```

### 2.2 Calcul du multiplicateur

Ajouter cette fonction dans `Practice/Show.tsx` :

```typescript
const calculateMultiplier = (currentStreak: number): number => {
    if (currentStreak < 5) return 1;
    if (currentStreak < 10) return 2;
    if (currentStreak < 20) return 3;
    if (currentStreak < 50) return 5;
    return 10;
};

const updateStreak = (isCorrect: boolean) => {
    if (isCorrect) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        setMaxStreak(Math.max(maxStreak, newStreak));
        setScoreMultiplier(calculateMultiplier(newStreak));
    } else {
        setStreak(0);
        setScoreMultiplier(1);
    }
};
```

### 2.3 Composant d'affichage du multiplicateur

**Fichier** : `resources/js/components/ScoreMultiplier.tsx`

```typescript
import React from 'react';

interface ScoreMultiplierProps {
    multiplier: number;
    streak: number;
}

export const ScoreMultiplier: React.FC<ScoreMultiplierProps> = ({
    multiplier,
    streak,
}) => {
    return (
        <div className="absolute top-4 left-4 z-10">
            <div
                className={`
                    bg-gradient-to-br from-yellow-400 to-orange-500
                    rounded-full px-6 py-3 shadow-lg
                    transform transition-all duration-300
                    ${multiplier > 1 ? 'scale-110' : 'scale-100'}
                `}
            >
                <div className="text-center">
                    <div className="text-3xl font-bold text-white">
                        {multiplier}x
                    </div>
                    <div className="text-xs text-white/80">
                        {streak} notes
                    </div>
                </div>
            </div>

            {/* Animation de particules quand le multiplicateur augmente */}
            {multiplier > 1 && (
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-ping"
                            style={{
                                top: '50%',
                                left: '50%',
                                animationDelay: `${i * 0.1}s`,
                                transform: `rotate(${i * 45}deg) translateX(30px)`,
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
```

### 2.4 Intégration dans Practice/Show.tsx

```typescript
import { ScoreMultiplier } from '@/components/ScoreMultiplier';

// Dans le JSX, avant le canvas
<div className="relative">
    <ScoreMultiplier multiplier={scoreMultiplier} streak={streak} />
    
    {gameSettings.instrumentMode === 'guitar' ? (
        <GuitarCanvas
            events={song.events}
            // ... autres props
        />
    ) : (
        <GameCanvas
            // ... props
        />
    )}
</div>
```

---

## Phase 3 : Effets visuels avancés

### 3.1 Trajet pointillé du doigt

**Fichier** : `resources/js/components/GuitarCanvas.tsx`

```typescript
const drawFingerPath = (
    ctx: CanvasRenderingContext2D,
    events: SongEvent[],
    currentTime: number
): void => {
    const numStrings = 6;
    const stringSpacing = (CANVAS_HEIGHT - 100) / (numStrings + 1);
    const startY = 50;
    const lookAheadTime = 3;

    // Trouver les prochaines notes
    const upcomingNotes = events
        .filter(
            (e) =>
                e.start_time > currentTime &&
                e.start_time < currentTime + lookAheadTime
        )
        .sort((a, b) => a.start_time - b.start_time)
        .slice(0, 5); // Limiter à 5 notes

    if (upcomingNotes.length < 2) return;

    ctx.save();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.globalAlpha = 0.5;

    ctx.beginPath();

    upcomingNotes.forEach((note, index) => {
        if (note.track === undefined) return;

        const stringY = startY + (note.track + 1) * stringSpacing;
        const progress = (note.start_time - currentTime) / lookAheadTime;
        const x = CANVAS_WIDTH - progress * CANVAS_WIDTH;

        if (index === 0) {
            ctx.moveTo(x, stringY);
            
            // Cercle de départ
            ctx.save();
            ctx.setLineDash([]);
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(x, stringY, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        } else {
            ctx.lineTo(x, stringY);
        }
    });

    ctx.stroke();
    ctx.restore();
};
```

Ajouter dans la fonction `draw()` :

```typescript
drawFingerPath(ctx, events, currentTime);
```

### 3.2 Effet de hit sur les cordes

```typescript
const drawStringVibration = (
    ctx: CanvasRenderingContext2D,
    stringIndex: number,
    intensity: number
): void => {
    const numStrings = 6;
    const stringSpacing = (CANVAS_HEIGHT - 100) / (numStrings + 1);
    const startY = 50;
    const stringY = startY + (stringIndex + 1) * stringSpacing;

    ctx.save();
    ctx.strokeStyle = STRING_COLORS[stringIndex];
    ctx.lineWidth = 3;
    ctx.globalAlpha = intensity;

    // Onde sinusoïdale pour simuler la vibration
    ctx.beginPath();
    for (let x = 0; x < CANVAS_WIDTH; x += 5) {
        const wave = Math.sin((x + Date.now()) / 20) * intensity * 5;
        if (x === 0) {
            ctx.moveTo(x, stringY + wave);
        } else {
            ctx.lineTo(x, stringY + wave);
        }
    }
    ctx.stroke();
    ctx.restore();
};
```

---

## Phase 4 : Main animée

### 4.1 Composant SVG de la main

**Fichier** : `resources/js/components/HandIndicator.tsx`

```typescript
import React from 'react';

interface HandIndicatorProps {
    activeFinger?: number; // 0-4
    position?: 'left' | 'right';
}

export const HandIndicator: React.FC<HandIndicatorProps> = ({
    activeFinger,
    position = 'right',
}) => {
    const FINGER_COLORS: Record<number, string> = {
        0: '#808080',
        1: '#E67E22',
        2: '#9B59B6',
        3: '#3498DB',
        4: '#E74C3C',
    };

    return (
        <div
            className={`
                absolute bottom-4 ${position === 'right' ? 'right-4' : 'left-4'}
                w-24 h-32 z-10
            `}
        >
            <svg
                viewBox="0 0 100 150"
                className="w-full h-full drop-shadow-lg"
            >
                {/* Paume */}
                <path
                    d="M 30 80 Q 25 100 30 120 L 70 120 Q 75 100 70 80 Z"
                    fill="#FFE0BD"
                    stroke="#D4A574"
                    strokeWidth="2"
                />

                {/* Pouce (0) */}
                <path
                    d="M 30 80 Q 20 70 15 60 L 20 50 Q 25 55 30 65 Z"
                    fill={activeFinger === 0 ? FINGER_COLORS[0] : '#FFE0BD'}
                    stroke="#D4A574"
                    strokeWidth="2"
                    className={activeFinger === 0 ? 'animate-pulse' : ''}
                />

                {/* Index (1) */}
                <rect
                    x="35"
                    y="20"
                    width="8"
                    height="60"
                    rx="4"
                    fill={activeFinger === 1 ? FINGER_COLORS[1] : '#FFE0BD'}
                    stroke="#D4A574"
                    strokeWidth="2"
                    className={activeFinger === 1 ? 'animate-pulse' : ''}
                />

                {/* Majeur (2) */}
                <rect
                    x="46"
                    y="15"
                    width="8"
                    height="65"
                    rx="4"
                    fill={activeFinger === 2 ? FINGER_COLORS[2] : '#FFE0BD'}
                    stroke="#D4A574"
                    strokeWidth="2"
                    className={activeFinger === 2 ? 'animate-pulse' : ''}
                />

                {/* Annulaire (3) */}
                <rect
                    x="57"
                    y="20"
                    width="8"
                    height="60"
                    rx="4"
                    fill={activeFinger === 3 ? FINGER_COLORS[3] : '#FFE0BD'}
                    stroke="#D4A574"
                    strokeWidth="2"
                    className={activeFinger === 3 ? 'animate-pulse' : ''}
                />

                {/* Auriculaire (4) */}
                <rect
                    x="68"
                    y="30"
                    width="7"
                    height="50"
                    rx="3.5"
                    fill={activeFinger === 4 ? FINGER_COLORS[4] : '#FFE0BD'}
                    stroke="#D4A574"
                    strokeWidth="2"
                    className={activeFinger === 4 ? 'animate-pulse' : ''}
                />
            </svg>

            {/* Label */}
            <div className="text-center text-xs text-white/70 mt-1">
                Main {position === 'right' ? 'droite' : 'gauche'}
            </div>
        </div>
    );
};
```

### 4.2 Intégration dans Practice/Show.tsx

```typescript
import { HandIndicator } from '@/components/HandIndicator';

// Ajouter un état pour le doigt actif
const [activeFinger, setActiveFinger] = useState<number | undefined>();

// Dans le JSX
<div className="relative">
    <ScoreMultiplier multiplier={scoreMultiplier} streak={streak} />
    <HandIndicator activeFinger={activeFinger} position="right" />
    
    {/* Canvas */}
</div>
```

---

## 🎯 Ordre d'implémentation recommandé

1. **Jour 1** : Phase 1 (Indicateurs de doigts)
   - Mise à jour des types
   - Migration de base de données
   - Fonction de dessin des indicateurs
   - Tests visuels

2. **Jour 2** : Phase 2 (Multiplicateur de score)
   - État et logique de calcul
   - Composant ScoreMultiplier
   - Intégration avec le système de scoring

3. **Jour 3** : Phase 3 (Effets visuels)
   - Trajet pointillé
   - Vibration des cordes
   - Animations de hit

4. **Jour 4** : Phase 4 (Main animée)
   - Composant HandIndicator
   - Synchronisation avec les notes
   - Polish et optimisations

---

## 🧪 Tests à effectuer

### Tests visuels
- [ ] Les indicateurs de doigts s'affichent correctement
- [ ] Les couleurs correspondent au code standard
- [ ] L'animation de pulsation fonctionne
- [ ] Le multiplicateur s'affiche et s'anime
- [ ] Le trajet pointillé est visible et fluide
- [ ] La main s'anime au bon moment

### Tests fonctionnels
- [ ] Le streak se réinitialise correctement
- [ ] Le multiplicateur augmente selon les paliers
- [ ] Les données de doigté sont sauvegardées en DB
- [ ] Les performances restent fluides (60 FPS)

### Tests d'accessibilité
- [ ] Les couleurs ont un contraste suffisant
- [ ] Les animations peuvent être désactivées
- [ ] Les indicateurs sont compréhensibles

---

## 📚 Ressources supplémentaires

- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Canvas Animation](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations)
- [Yousician Design Patterns](https://www.yousician.com/)

---

## 🐛 Dépannage

### Les indicateurs ne s'affichent pas
- Vérifier que `finger` est défini dans les `SongEvent`
- Vérifier l'ordre d'appel dans `draw()`
- Vérifier les coordonnées X/Y

### Le multiplicateur ne change pas
- Vérifier la logique de `updateStreak()`
- Vérifier que `isCorrect` est bien passé
- Console.log le streak actuel

### Performances dégradées
- Limiter le nombre de particules
- Utiliser `requestAnimationFrame` correctement
- Optimiser les calculs dans `draw()`

---

**Document créé le** : 2026-05-12  
**Version** : 1.0  
**Auteur** : Bob (Assistant IA)
