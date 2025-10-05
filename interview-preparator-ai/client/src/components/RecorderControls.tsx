/**
 * Recording control buttons with keyboard shortcuts
 */

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

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
          <Button
            onClick={onStart}
            disabled={isDisabled}
            variant="primary"
            size="lg"
            aria-label="Start recording (Space)"
          >
            Start Recording
          </Button>
        ) : (
          <Button
            onClick={onStop}
            variant="primary"
            size="lg"
            className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 focus:ring-red-500"
            aria-label="Stop recording (Space)"
          >
            Stop Recording
          </Button>
        )}

        <Button
          onClick={onSkip}
          variant="outline"
          size="lg"
          aria-label="Skip to next question (N)"
        >
          {isRecording ? 'Skip (N)' : 'Next (N)'}
        </Button>

        {isRecording && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Recording...
            </span>
          </div>
        )}
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="text-xs text-gray-500 dark:text-slate-400">
        <span className="font-semibold">Shortcuts:</span> Space = Start/Stop, N = Skip/Next
      </div>
    </div>
  );
}
