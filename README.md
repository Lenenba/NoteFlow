# 🎵 NoteFlow - Interactive Music Practice Application

A modern web application for practicing chord progressions with real-time MIDI input, inspired by Yousician. Built with Laravel, React, TypeScript, and Inertia.js.

## ✨ Features

### 🎹 Core Features (MVP - Sprints 1-3)
- **MIDI Input Detection**: Connect your MIDI keyboard and practice in real-time
- **Chord Recognition**: Automatic recognition of major, minor, diminished, augmented, and 7th chords
- **Visual Feedback**: Animated chord blocks that scroll toward a hit line (Guitar Hero style)
- **Real-time Validation**: Instant feedback on timing and accuracy (Perfect/Good/Early/Late/Wrong/Miss)
- **Scoring System**: Track your score, accuracy, and streak during practice
- **Practice Sessions**: All sessions are automatically saved to the database

### 🎼 Song Management (Sprint 4)
- **Song Library**: Browse and filter songs by difficulty
- **Song Editor**: Create custom chord progressions with:
  - Multiple tracks support
  - Precise timing control
  - BPM and key configuration
  - Difficulty levels (Beginner/Intermediate/Advanced)

### 🎨 Visual Enhancements (Sprint 5)
- **Smooth Animations**: 60 FPS canvas rendering with requestAnimationFrame
- **Feedback Animations**: Visual effects for different feedback types
- **Score Animations**: Animated score updates and streak counters
- **Responsive Design**: Works on desktop browsers

## 🛠️ Tech Stack

### Backend
- **Laravel 12**: PHP framework for robust backend
- **MySQL/SQLite**: Database for storing songs and sessions
- **Inertia.js**: Modern monolith architecture

### Frontend
- **React 18**: UI library with hooks
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Beautiful UI components
- **Canvas API**: High-performance animation rendering

### Music Technology
- **Web MIDI API**: Browser-based MIDI device access
- **Custom Chord Recognition**: Algorithm for detecting chords from MIDI notes
- **Precise Timing**: Using `performance.now()` for accurate timing

## 📦 Installation

### Prerequisites
- **[Laravel Herd](https://herd.laravel.com/)** (Recommended) - Native Laravel development environment
  - OR PHP 8.3+, Composer, and a web server
- Node.js 18+
- npm or pnpm

### 🚀 Quick Start with Herd (Recommended)

[Herd](https://herd.laravel.com/) provides a native Laravel development environment with PHP, Nginx, and databases pre-configured.

1. **Install Herd**
   - Download from [herd.laravel.com](https://herd.laravel.com/)
   - Herd automatically manages PHP versions and serves your Laravel apps

2. **Clone and setup**
```bash
git clone <repository-url>
cd NoteFlow
composer install
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
php artisan key:generate
```

4. **Setup database**
```bash
# Herd includes SQLite by default
php artisan migrate:fresh --seed
```

5. **Start development**
```bash
# Herd automatically serves your app at noteflow.test
# Just run Vite for hot module replacement
npm run dev
```

6. **Access your app**
   - Visit `http://noteflow.test` in your browser
   - Herd automatically creates a `.test` domain for your project

### 🔧 Alternative Setup (Without Herd)

1. **Clone the repository**
```bash
git clone <repository-url>
cd NoteFlow
```

2. **Install dependencies**
```bash
composer install
npm install
```

3. **Environment configuration**
```bash
cp .env.example .env
php artisan key:generate
```

4. **Database setup**
```bash
# Configure your database in .env
php artisan migrate:fresh --seed
```

5. **Start the development server**
```bash
# Option 1: Use the built-in dev script (runs server + queue + vite)
composer dev

# Option 2: Run components separately
php artisan serve
npm run dev
```

6. **Access your app**
   - Visit `http://localhost:8000` in your browser

## 🎮 Usage

### Getting Started

1. **Connect Your MIDI Device**
   - Plug in your MIDI keyboard
   - The browser will request permission to access MIDI devices
   - Grant permission to enable real-time chord detection

2. **Browse Songs**
   - Navigate to the Songs page
   - Filter by difficulty level
   - Click "Practice" on any song

3. **Practice Mode**
   - Watch chord blocks scroll toward the green hit line
   - Play the chords on your MIDI keyboard at the right time
   - Receive instant feedback on your performance
   - Track your score, accuracy, and streak

4. **Create Custom Songs**
   - Click "Create Song" from the Songs page
   - Fill in song details (title, BPM, key, difficulty)
   - Add chord events with precise timing
   - Save and practice your custom progression

### Feedback System

- **Perfect** (100 pts): Played within ±50ms of the target time
- **Good** (75 pts): Played within ±150ms of the target time
- **Early** (50 pts): Played too early (within 300ms before)
- **Late** (50 pts): Played too late (within 300ms after)
- **Wrong** (0 pts): Incorrect chord played
- **Miss** (0 pts): No chord played when expected

## 🏗️ Architecture

### Database Schema

```
songs
├── id
├── user_id
├── title
├── description
├── bpm
├── duration
├── key
├── difficulty
├── is_public
└── timestamps

song_events
├── id
├── song_id
├── chord
├── start_time
├── duration
├── track
└── timestamps

practice_sessions
├── id
├── user_id
├── song_id
├── score
├── accuracy
├── max_streak
├── completed_at
└── timestamps

practice_results
├── id
├── practice_session_id
├── song_event_id
├── feedback
├── timing_offset
└── timestamps
```

### Key Services

#### SongScheduler (`resources/js/services/songScheduler.ts`)
- Manages musical timing using `performance.now()`
- Handles play/pause/restart functionality
- Emits events for time updates and chord changes

#### MIDIService (`resources/js/services/midiService.ts`)
- Interfaces with Web MIDI API
- Detects note on/off events
- Manages MIDI device connections

#### ChordRecognizer (`resources/js/services/chordRecognizer.ts`)
- Converts MIDI note numbers to chord names
- Recognizes major, minor, diminished, augmented, and 7th chords
- Handles chord inversions and enharmonic equivalents

#### TimingValidator (`resources/js/services/timingValidator.ts`)
- Validates chord timing against expected events
- Calculates feedback based on timing windows
- Computes scores and statistics

### Components

#### GameCanvas (`resources/js/components/GameCanvas.tsx`)
- Renders animated chord blocks using Canvas API
- 60 FPS animation with `requestAnimationFrame`
- Visual representation of song timeline

#### FeedbackBadge (`resources/js/components/FeedbackBadge.tsx`)
- Displays real-time feedback with animations
- Color-coded by feedback type
- Auto-dismisses after display

## 🎯 Roadmap

### Completed (Sprints 1-5)
- ✅ Infrastructure & Database Setup
- ✅ Practice Page & Music Engine
- ✅ Canvas Animation System
- ✅ MIDI Detection Integration
- ✅ Chord Recognition System
- ✅ Validation & Feedback System
- ✅ Scoring & Session Management
- ✅ Song Editor Interface
- ✅ Visual Enhancements & Polish

### Future Enhancements (Sprints 6-10)
- 🔄 Advanced Features
  - Transposition to different keys
  - Adjustable BPM during practice
  - Loop mode for specific sections
  - Detailed statistics and progress tracking

- 👨‍🏫 Teacher Mode
  - Create classes and manage students
  - Assign exercises to students
  - Track student progress
  - Provide feedback and comments

- 📥 Import/Export
  - ChordPro format support
  - MIDI file import
  - Session export
  - Exercise sharing

- 💰 SaaS Features
  - Subscription plans
  - Payment integration
  - Usage limitations by plan
  - Admin dashboard

- 🚀 Advanced Features
  - Microphone-based note detection
  - Guitar tablature support
  - MusicXML import for classical scores
  - Mobile app (React Native)
  - Multiplayer mode

## 🧪 Testing

```bash
# Run PHP tests
php artisan test

# Run JavaScript tests (if configured)
npm run test
```

## 📝 Development

### Code Structure

```
app/
├── Http/Controllers/
│   ├── SongController.php
│   └── PracticeSessionController.php
├── Models/
│   ├── Song.php
│   ├── SongEvent.php
│   ├── PracticeSession.php
│   └── PracticeResult.php

resources/
├── js/
│   ├── components/
│   │   ├── GameCanvas.tsx
│   │   ├── FeedbackBadge.tsx
│   │   └── ui/
│   ├── pages/
│   │   ├── Songs/
│   │   │   ├── Index.tsx
│   │   │   └── Create.tsx
│   │   └── Practice/
│   │       └── Show.tsx
│   ├── services/
│   │   ├── songScheduler.ts
│   │   ├── midiService.ts
│   │   ├── chordRecognizer.ts
│   │   └── timingValidator.ts
│   └── types/
│       └── music.ts
└── css/
    └── animations.css
```

### Adding New Chords

To add support for new chord types, update the `CHORD_PATTERNS` in `ChordRecognizer`:

```typescript
private static readonly CHORD_PATTERNS: Record<string, number[]> = {
    '': [0, 4, 7],        // Major
    'm': [0, 3, 7],       // Minor
    'dim': [0, 3, 6],     // Diminished
    'aug': [0, 4, 8],     // Augmented
    '7': [0, 4, 7, 10],   // Dominant 7th
    // Add your new chord pattern here
    'add9': [0, 4, 7, 14], // Major add9
};
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by [Yousician](https://yousician.com/)
- Built with [Laravel](https://laravel.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Made with ❤️ and 🎵 by Bob (AI Assistant)**
