# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2025-10-04

### Added
- **Answer Relevance Scoring System**
  - Local keyword-based relevance analysis (0-100 score)
  - Three-tier verdict system: on_topic, partially_on_topic, off_topic
  - Domain-specific keyword dictionaries for Frontend, Backend, and Data roles
  - Off-topic detection with blacklist penalties
  - Matched and missing keywords visualization
  - Optional backend API support for LLM-based scoring
  - Relevance card in report page with actionable feedback

- **Auto-End Detection**
  - Multi-signal silence detection (configurable 1.8s default)
  - Wrap-up phrase recognition ("in summary", "that's all", etc.)
  - Minimum speaking duration guard (7s default)
  - Prevents premature endings

- **Auto-Advance Flow**
  - Automatic progression to next question after answer capture
  - Toast notification with countdown (2.5s default)
  - Cancel option to review current answer
  - Question history tracking
  - Configurable settings per session

- **Enhanced Controls**
  - Skip/Next button with smart labeling
  - Keyboard shortcuts: Space (start/stop), N (skip/next)
  - Visual shortcut hints
  - Accessibility improvements (aria-labels, focus states)

- **New UI Components**
  - `RelevanceCard`: Display relevance analysis with keywords
  - `Toast`: Dismissible notifications for auto-advance

- **Testing**
  - Unit tests for relevance scoring
  - Test coverage for on-topic, partially on-topic, and off-topic scenarios
  - Keyword detection validation per role

### Changed
- **State Management**
  - Extended Zustand store with `relevance`, `settings`, `history`
  - New actions: `finalizeAnswerAndScore()`, `goToNextQuestion()`, `skipQuestion()`
  - Session status tracking: `completed`, `skipped`, `in_progress`

- **Speech Recognition**
  - Enhanced `useSpeech` hook with silence tracking
  - Added `onAutoEnd`, `onPartialUpdate` callbacks
  - Configurable timeouts for silence and minimum speaking

- **Session Page**
  - Integrated auto-end detection
  - Processing state indicator
  - Auto-advance toast notifications
  - Enhanced timer with auto-complete

- **Report Page**
  - Added relevance card display
  - Enhanced CSV export with relevance metrics
  - Integrated relevance suggestions

- **RecorderControls**
  - Added Skip button
  - Keyboard event handling
  - Improved button states

### Fixed
- Timer re-render issues with callback dependencies
- Video flickering from repeated initialization
- Circular dependencies in auto-end detection

### Performance
- Relevance scoring: ~5-15ms (synchronous, local)
- No impact on existing face mesh or speech recognition
- Efficient timer cleanup prevents memory leaks

## [1.0.0] - Initial Release

### Added
- Real-time video capture with MediaPipe Face Mesh
- Web Speech Recognition for transcription
- STAR framework analysis
- Speaking metrics (WPM, filler words, pace)
- Attention and body language tracking
- Comprehensive feedback reports
- JSON/CSV export functionality
- 60 behavioral questions across 3 roles
- Browser compatibility checks
- Graceful error handling

---

See [FEATURES_UPDATE.md](./FEATURES_UPDATE.md) for detailed feature documentation.
