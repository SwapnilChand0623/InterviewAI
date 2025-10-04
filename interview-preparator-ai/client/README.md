# Interview Preparator AI - Client

React + TypeScript + Vite frontend for the Interview Preparator AI application.

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **Zustand** - State management
- **React Router** - Navigation
- **MediaPipe Face Mesh** - Face tracking
- **Web Speech API** - Speech recognition

## Development

```bash
# Install dependencies
npm install

# Start dev server (with HTTPS for camera access)
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## Key Features

### Hooks

- `useCapture` - Manages getUserMedia video/audio streams
- `useSpeech` - Wraps Web Speech Recognition API
- `useFaceMesh` - MediaPipe face landmark tracking

### Analysis Modules

- `analysis/text.ts` - WPM, filler words, pace
- `analysis/star.ts` - STAR framework scoring
- `analysis/attention.ts` - Head stability, gaze tracking

### Components

- `CameraPreview` - Video display with mirroring
- `LandmarkOverlay` - Canvas overlay for face mesh
- `Timer` - Circular countdown timer
- `StarBars` - STAR component progress bars
- `MetricCard` - Reusable metric display
- `QuestionPicker` - Role and duration selection

## Browser Requirements

- Modern browser with ES2020+ support
- getUserMedia API (camera/microphone)
- Web Speech Recognition (optional but recommended)

## Configuration

Edit `.env`:

```
VITE_USE_BACKEND=false
API_BASE_URL=http://localhost:3001
```

## Architecture

```
src/
├── components/      # Presentational components
├── features/        # Feature-based modules
│   ├── capture/    # Media capture
│   ├── speech/     # Speech recognition
│   ├── landmarks/  # Face tracking
│   ├── analysis/   # Metric computation
│   └── state/      # Zustand store
├── pages/          # Route pages
├── lib/            # Utilities and data
├── App.tsx         # Router setup
└── main.tsx        # Entry point
```

## Adding New Questions

Edit `src/lib/questions.ts`:

```typescript
export const QUESTIONS = {
  your_role_skill: [
    { id: 'yr1', q: 'Your question here?' },
  ],
};
```

Update the dropdown in `QuestionPicker.tsx`.

## Customizing Metrics

### Adjust WPM Targets

Edit `src/features/analysis/text.ts`:

```typescript
export function ratePace(wpm: number): 'slow' | 'good' | 'fast' {
  if (wpm < 120) return 'slow'; // Adjust threshold
  if (wpm > 160) return 'fast';  // Adjust threshold
  return 'good';
}
```

### Modify STAR Keywords

Edit `src/features/analysis/star.ts`:

```typescript
const STAR_KEYWORDS = {
  S: ['your', 'custom', 'keywords'],
  // ...
};
```

## Performance

- Face mesh runs at ~30 FPS on modern hardware
- Speech recognition has minimal overhead
- Analysis is computed only once at session end
- Consider throttling face mesh updates if CPU usage is high

## Known Limitations

- Speech Recognition not available in Firefox
- Face tracking requires good lighting
- Large head movements may lose tracking
- Mobile Safari has getUserMedia quirks
