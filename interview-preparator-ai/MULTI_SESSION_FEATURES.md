# Multi-Session Architecture Enhancement

This document describes the new multi-question session architecture and features added to the Interview Preparator AI application.

## New Features

### 1. Multi-Question Sessions

Users can now configure sessions with multiple questions (1, 3, 5, or 10 questions) instead of being limited to a single question per session.

**Key Features:**
- Configure number of questions when starting a session
- Seamless navigation between questions
- Session progress tracking
- Ability to skip questions or move to the next one
- Continuous video/audio capture across questions

### 2. Intelligent Question Management

The system now includes smart question selection to improve the user experience:

**Features:**
- **Question Deduplication**: Tracks the last 20 answered questions to avoid repetition
- **Session-Level Deduplication**: Ensures no duplicate questions within the same session
- **Persistent History**: Stores question history across sessions in localStorage
- **Smart Fallbacks**: Handles cases where the question pool is exhausted

**Implementation:**
- `getSessionQuestions()`: Generates multiple unique questions for a session
- `getNextQuestion()`: Selects the next question avoiding recently used ones
- Question history stored in localStorage with a 50-question limit

### 3. Session History & Analytics

A new History page allows users to review past sessions and track progress over time.

**Features:**
- View all completed sessions with summary statistics
- Overall performance metrics (average WPM, attention, STAR score)
- Per-session breakdown with question details
- Session timestamps and duration tracking
- Ability to clear history

**Storage:**
- Uses localStorage for persistent storage
- Stores up to 100 recent sessions
- Tracks up to 50 recent question IDs
- Automatic cleanup of old data

### 4. Enhanced Session State Management

The Zustand store has been significantly enhanced to support multi-question sessions:

**New State Properties:**
```typescript
interface SessionInfo {
  questions: Question[];           // Array of questions
  currentQuestionIndex: number;    // Track current position
  isPaused: boolean;               // Pause state support
  pausedTime: number | null;       // Pause timestamp
}

interface SessionMetrics {
  sessionAnswers: SessionAnswer[]; // All answers in session
  currentQuestionStartTime: number | null;
}
```

**New Actions:**
- `nextQuestion()`: Move to next question
- `pauseSession()`: Pause the current session
- `resumeSession()`: Resume a paused session
- `getCurrentQuestion()`: Get the active question
- `saveCurrentAnswer()`: Save answer before moving to next

### 5. Enhanced Report Page

The Report page now displays comprehensive results for multi-question sessions:

**Features:**
- Session overview with aggregate metrics
- Per-question breakdown with individual metrics
- Collapsible sections for each question
- Combined feedback and suggestions
- CSV export with all questions

### 6. Question Interface Enhancement

Questions now support optional metadata:

```typescript
interface Question {
  id: QuestionId;
  q: string;
  difficulty?: 'entry' | 'mid' | 'senior';
  category?: 'behavioral' | 'technical' | 'situational';
  tags?: string[];
  estimatedDuration?: number;
}
```

This enables future features like:
- Difficulty-based progression
- Category balancing
- Role-specific filtering
- Time-based recommendations

## File Changes

### New Files
- `src/lib/sessionStorage.ts`: Session persistence and history management
- `src/pages/History.tsx`: Session history view page
- `MULTI_SESSION_FEATURES.md`: This documentation file

### Modified Files
- `src/lib/questions.ts`: Enhanced question interface and selection logic
- `src/features/state/store.ts`: Multi-question session state management
- `src/pages/Home.tsx`: Multi-question configuration UI
- `src/pages/Session.tsx`: Question navigation and progress tracking
- `src/pages/Report.tsx`: Multi-question results display
- `src/components/QuestionPicker.tsx`: Question count selector
- `src/App.tsx`: Added history route
- `src/features/speech/useSpeech.ts`: Fixed TypeScript errors
- `src/lib/utils.ts`: Fixed SpeechRecognition type issues
- `src/test/setup.ts`: Updated test globals

## Usage Guide

### Starting a Multi-Question Session

1. Navigate to the home page
2. Select your role (Front-End React, Back-End Node.js, or Data SQL)
3. Choose answer duration per question (1-5 minutes)
4. Select number of questions (1, 3, 5, or 10)
5. Click "Start Mock Interview"

### During the Session

- View current question number and total (e.g., "Question 2 of 5")
- Start recording when ready
- Click "Finish & Next Question" to save and move forward
- Click "Skip to Next Question" to skip without recording
- Session automatically ends after all questions

### Viewing History

1. Click the "📊 History" button on the home page
2. View overall statistics and session list
3. Each session shows:
   - Role and timestamp
   - Duration and question count
   - Average metrics (WPM, attention, STAR score)
   - Preview of questions asked

### Reviewing Reports

- Reports now show all questions answered in the session
- Session overview displays aggregate metrics
- Each question has its own detailed breakdown
- Combined suggestions from all questions
- Export all data to CSV for external analysis

## Technical Implementation Details

### State Flow

1. **Session Start**: Generate N unique questions from role's question bank
2. **Question Recording**: Track metrics per question
3. **Question Transition**: Save current answer, move to next, reset metrics
4. **Session End**: Aggregate all answers, save to history, navigate to report

### Data Persistence

- **localStorage Keys**:
  - `interview_ai_session_history`: Completed sessions (max 100)
  - `interview_ai_question_history`: Recent question IDs (max 50)

- **Data Structure**:
```typescript
{
  sessions: CompletedSession[],
  totalSessions: number,
  totalQuestions: number,
  questionHistory: Set<string>
}
```

### Question Selection Algorithm

1. Get all questions for selected role
2. Filter out recently used questions (last 20)
3. Filter out questions already in current session
4. Shuffle remaining questions
5. Select requested number of questions
6. Fallback: Use all available if insufficient unique questions

## Future Enhancements

The foundation is now in place for:

- **Adaptive Difficulty**: Adjust question difficulty based on performance
- **Category Balancing**: Mix behavioral, technical, and situational questions
- **Performance Trends**: Chart progress over time
- **Achievements & Gamification**: Streaks, badges, milestones
- **Smart Recommendations**: Suggest focus areas based on weak points
- **Role-Specific Paths**: Curated question sequences for different roles
- **Time-Based Practice**: Optimize for specific interview lengths
- **Question Filtering**: Search and filter question bank
- **Custom Questions**: Allow users to add their own questions
- **Session Sharing**: Export and share session results

## Browser Compatibility

All features work with:
- Chrome/Edge (recommended for best speech recognition)
- Firefox (limited speech recognition)
- Safari (limited speech recognition)

Requires:
- HTTPS or localhost for camera/microphone access
- Modern browser with getUserMedia support
- localStorage enabled

## Performance Considerations

- Session data stored locally (no server required)
- Minimal memory footprint (automatic cleanup)
- Efficient question selection (O(n) complexity)
- Lazy loading of analysis modules
- Optimized re-renders in React components

## Testing

All existing functionality preserved:
- Single-question sessions still work
- All metrics calculated correctly
- MediaPipe face tracking maintains continuity
- Speech recognition continues across questions
- No breaking changes to existing API
