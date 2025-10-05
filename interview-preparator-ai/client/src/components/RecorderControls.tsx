/**
 * Recording control buttons with keyboard shortcuts
 */

import { useEffect } from 'react';

interface RecorderControlsProps {
  isRecording: boolean;
  isDisabled?: boolean;
  onStart: () => void;
  onStop: () => void;
  onSkip: () => void;
  className?: string;
}

export function RecorderControls({
  isRecording,
  isDisabled = false,
  onStart,
  onStop,
  onSkip,
  className = '',
}: RecorderControlsProps) {
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Space: Start/Stop recording
      if (e.code === 'Space' && !isDisabled) {
        e.preventDefault();
        if (isRecording) {
          onStop();
        } else {
          onStart();
        }
      }

      // N: Skip/Next question
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        onSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRecording, isDisabled, onStart, onStop, onSkip]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-3 flex-wrap">
        {!isRecording ? (
          <button
            onClick={onStart}
            disabled={isDisabled}
            className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Start recording (Space)"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={onStop}
            className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Stop recording (Space)"
          >
            Stop Recording
          </button>
        )}

        <button
          onClick={onSkip}
          className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          aria-label="Skip to next question (N)"
        >
          {isRecording ? 'Skip (N)' : 'Next (N)'}
        </button>

        {isRecording && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-700">
              Recording...
            </span>
          </div>
        )}
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="text-xs text-gray-500">
        <span className="font-semibold">Shortcuts:</span> Space = Start/Stop, N = Skip/Next
      </div>
    </div>
  );
}
