# Music Practice Game Implementation

## Overview

A polished React + TypeScript interactive music practice screen inspired by modern music learning games. Features a "music highway" interface where chord blocks move toward a hit line with real-time visual feedback.

## Architecture

### Core Technologies
- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **Rendering**: HTML Canvas with requestAnimationFrame
- **Animation**: Performance-optimized with time-based movement

### File Structure

```
resources/js/
├── types/
│   └── musicGame.ts                    # TypeScript interfaces
├── services/music/
│   ├── demoSong.ts                     # Demo song data and theme
│   ├── gameProjection.ts               # Perspective projection utilities
│   └── gameTiming.ts                   # Game timing and scoring logic
├── Components/MusicGame/
│   ├── MusicPracticeGame.tsx           # Main game component
│   ├── MusicHighwayCanvas.tsx          # Canvas rendering with perspective
│   ├── GameHud.tsx                     # Heads-up display
│   ├── ComboBadge.tsx                  # Combo multiplier display
│   ├── ScoreCounter.tsx                # Score display
│   ├── GameFeedbackBadge.tsx           # Feedback text (Perfect, Good, etc.)
│   ├── TransportControls.tsx           # Play/pause button
│   ├── SongMiniMap.tsx                 # Timeline progress bar
│   ├── StrumIndicator.tsx              # Hand/strum visual indicator
│   ├── PauseOverlay.tsx                # Pause menu
│   └── SpeedControl.tsx                # Speed adjustment controls
└── Pages/MusicPractice/
    └── Show.tsx                        # Page component with orientation check
```

## Key Features

### 1. Perspective Highway Rendering
- **3D Perspective**: Trapezoid-shaped fretboard with depth illusion
- **Six String Lines**: Horizontal lines representing guitar strings
- **Measure Grid**: Vertical lines moving with time for depth perception
- **Hit Line**: White glowing line at 78% of screen height

### 2. Visual Elements

#### Background
- Lime/green gradient (#B8F34A to #8FD728)
- Soft wave shapes with bezier curves
- Floating particles for atmosphere

#### Chord Blocks
- Large colored trapezoid shapes
- Perspective scaling (smaller when far, larger when near)
- White bold labels
- Pattern lines for texture
- Shadow effects

#### Note Capsules
- Rounded pill shapes on string lanes
- Fret numbers displayed
- Color-coded by type
- Duration-based width

### 3. Game Mechanics

#### Scoring System
- **Perfect**: 100 points × multiplier
- **Good**: 75 points × multiplier
- **Late**: 50 points × multiplier
- **Wrong/Miss**: 0 points, combo reset

#### Combo Multiplier
- 1x: 0-4 combo
- 2x: 5-9 combo
- 3x: 10-14 combo
- 4x: 15-19 combo
- 5x: 20-29 combo
- 6x: 30-39 combo
- 7x: 40-49 combo
- 8x: 50+ combo

#### Feedback System
- Animated text appearing at hit line
- Color-coded by accuracy
- Particle burst for Perfect hits
- Strum indicator activation

### 4. HUD Components

#### Top Layer
- **Top-left**: Combo badge with progress bar
- **Top-right**: Score counter with formatting
- **Top-center**: Current section label (Verse, Chorus, etc.)

#### Bottom Layer
- **Bottom-left**: Large play/pause button
- **Bottom-center**: Mini timeline with colored event markers
- **Bottom-right**: Hand/strum indicator with intensity bars

### 5. Pause Menu

Features:
- Exit, Restart, Perform, Options buttons
- Speed control (50% - 200%)
- Toggle switches:
  - Auto Speed
  - Metronome
  - Guitar Sound
  - Left Handed Mode

### 6. Projection System

The game uses a sophisticated projection system to create depth:

```typescript
// Time-based projection
depth = clamp(1 - timeToHit / visibleAheadSeconds, 0, 1)
y = farY + depth * (hitLineY - farY)
scale = 0.45 + depth * 0.85
opacity = 0.35 + depth * 0.65
width = farWidth + depth * (nearWidth - farWidth)
```

**Parameters**:
- `visibleAheadSeconds`: 10 seconds
- `farY`: 38% of canvas height
- `hitLineY`: 78% of canvas height
- `farWidth`: 45% of canvas width
- `nearWidth`: 115% of canvas width

### 7. Animation Loop

Uses `requestAnimationFrame` for smooth 60fps animation:
- Time-based movement (not frame-based)
- Delta time calculations
- Particle system updates
- Feedback animation updates
- Event detection at hit line

### 8. Demo Song Data

**Title**: Beginner Chord Highway  
**BPM**: 90  
**Duration**: 40 seconds

**Sections**:
- Interlude (0-8s)
- Verse (8-24s)
- Chorus 1 (24-40s)

**Chords**: A, D, E, Em, G, C  
**Notes**: Fret numbers 0, 2, 3, 5, 7 on various strings

### 9. Color Palette

```typescript
bgTopColor: '#B8F34A'        // Lime top
bgBottomColor: '#8FD728'     // Green bottom
accentColor: '#79C928'       // Green accent
fretboardDark: '#242826'     // Dark fretboard
fretboardMid: '#343836'      // Mid fretboard
stringColor: '#D9D9D9'       // String lines
gridColor: 'rgba(160, 255, 80, 0.35)'  // Grid lines
blueChord: '#009FE3'         // Blue chord
orangeChord: '#F6A800'       // Orange chord
purpleChord: '#B824F5'       // Purple chord
greenChord: '#79C928'        // Green chord
greyChord: '#A5A5A5'         // Grey muted
wrongRed: '#FF4E4E'          // Wrong feedback
whiteText: '#FFFFFF'         // Text color
darkOverlay: 'rgba(0, 0, 0, 0.25)'  // Overlay
```

## Responsive Design

### Desktop
- Full screen centered layout
- Optimized for 16:9 aspect ratio

### Tablet/Mobile Landscape
- Full screen layout
- Touch-optimized controls

### Mobile Portrait
- Rotation prompt screen
- Message: "Rotate your device to play in landscape mode"

## Performance Optimizations

1. **Canvas Rendering**
   - Device pixel ratio handling
   - Efficient redraw on state changes only
   - Minimal DOM manipulation

2. **Animation**
   - RequestAnimationFrame for smooth 60fps
   - Time-based movement for consistency
   - Particle lifecycle management

3. **React Optimization**
   - useCallback for stable function references
   - useRef for animation state
   - Minimal re-renders

4. **Memory Management**
   - Particle cleanup after lifetime
   - Feedback removal after animation
   - Event processing tracking

## Usage

### Accessing the Game

Navigate to the music practice page:
```
/music-practice/show
```

### Controls

- **Play/Pause**: Click the bottom-left button
- **Restart**: Pause menu → Restart button
- **Exit**: Pause menu → Exit button
- **Speed Control**: Pause menu → Adjust slider
- **Settings**: Pause menu → Toggle switches

### Game Flow

1. Game starts paused
2. Press Play to begin
3. Chord blocks move toward hit line
4. Feedback appears when events reach hit line
5. Score and combo increase with successful hits
6. Pause anytime to adjust settings
7. Restart to play again

## Future Enhancements

### Phase 1 (Current)
- ✅ Visual game interface
- ✅ Demo song playback
- ✅ Scoring system
- ✅ Feedback animations

### Phase 2 (Planned)
- [ ] Real MIDI input validation
- [ ] Multiple song support
- [ ] Difficulty levels
- [ ] Practice mode with slow-down
- [ ] Recording and playback

### Phase 3 (Future)
- [ ] Multiplayer support
- [ ] Leaderboards
- [ ] Achievement system
- [ ] Custom song import
- [ ] Advanced analytics

## Technical Notes

### Canvas Drawing Functions

Key rendering functions in [`MusicHighwayCanvas.tsx`](../resources/js/Components/MusicGame/MusicHighwayCanvas.tsx):
- `drawBackground()`: Gradient and wave shapes
- `drawHighwayBase()`: Trapezoid fretboard
- `drawPerspectiveGrid()`: Moving measure lines
- `drawStrings()`: Six guitar strings
- `drawHitLine()`: White glow marker
- `drawChordBlock()`: Perspective chord blocks
- `drawNoteCapsule()`: Fret number capsules
- `drawFeedbackParticles()`: Particle effects

### State Management

Game state includes:
- `isPlaying`: Animation active
- `isPaused`: Pause menu visible
- `currentTime`: Song position in seconds
- `score`: Current score
- `combo`: Current combo count
- `maxCombo`: Highest combo achieved
- `speed`: Playback speed (0.5 - 2.0)
- Settings: autoSpeed, metronome, guitarSound, leftHanded

### Event Processing

Events are processed once using a Set to track IDs:
```typescript
processedEventsRef.current.has(event.id)
processedEventsRef.current.add(event.id)
```

## Troubleshooting

### Canvas Not Rendering
- Check browser console for errors
- Verify canvas ref is attached
- Ensure window has loaded

### Performance Issues
- Reduce particle count
- Lower canvas resolution
- Check for memory leaks

### Animation Stuttering
- Verify requestAnimationFrame is used
- Check for blocking operations
- Monitor frame rate in DevTools

## Credits

Built with:
- React 18
- TypeScript 5
- Tailwind CSS 3
- Lucide React Icons
- HTML5 Canvas API

Inspired by modern music learning games while maintaining an original design.
