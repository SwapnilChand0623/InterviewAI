/**
 * Recording control buttons with keyboard shortcuts
 */

import { useEffect, useState } from 'react';
import { useStore } from '@/features/state/store';

interface RecorderControlsProps {
  isRecording: boolean;
  isDisabled?: boolean;
  onStart: () => void;
  onStop: () => void;
  onSkip: () => void;
  className?: string;
  ttsEnabled?: boolean;
  ttsVoice?: string;
  ttsRate?: number;
  ttsPitch?: number;
  ttsSupported?: boolean;
  ttsVoices?: SpeechSynthesisVoice[];
  isTtsSpeaking?: boolean;
}

export function RecorderControls({
  isRecording,
  isDisabled = false,
  onStart,
  onStop,
  onSkip,
  className = '',
  ttsEnabled = false,
  ttsVoice,
  ttsRate = 1.0,
  ttsPitch = 1.0,
  ttsSupported = false,
  ttsVoices = [],
  isTtsSpeaking = false,
}: RecorderControlsProps) {
  const { updateTtsSettings } = useStore();
  const [showTtsSettings, setShowTtsSettings] = useState(false);
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
            title={isTtsSpeaking ? 'Wait for question to finish' : 'Start recording'}
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

        {isTtsSpeaking && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-blue-700">
              Reading question...
            </span>
          </div>
        )}
      </div>

      {/* TTS Settings */}
      {ttsSupported && (
        <div className="border-t pt-4">
          <button
            onClick={() => setShowTtsSettings(!showTtsSettings)}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            <span>⚙️</span>
            <span>TTS Settings</span>
            <span className="text-xs">{showTtsSettings ? '▲' : '▼'}</span>
          </button>
          
          {showTtsSettings && (
            <div className="mt-3 space-y-3 p-3 bg-gray-50 rounded-lg">
              {/* Toggle TTS */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={ttsEnabled}
                  onChange={(e) => updateTtsSettings({ ttsEnabled: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Read questions aloud</span>
              </label>

              {ttsEnabled && (
                <>
                  {/* Voice Selection */}
                  {ttsVoices.length > 0 && (
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Voice</label>
                      <select
                        value={ttsVoice || ''}
                        onChange={(e) => updateTtsSettings({ ttsVoice: e.target.value })}
                        className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="">Default</option>
                        {ttsVoices.map((voice) => (
                          <option key={voice.name} value={voice.name}>
                            {voice.name} ({voice.lang})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Rate Slider */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Rate: {ttsRate.toFixed(2)}x
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="1.5"
                      step="0.05"
                      value={ttsRate}
                      onChange={(e) => updateTtsSettings({ ttsRate: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  {/* Pitch Slider */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Pitch: {ttsPitch.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="1.5"
                      step="0.05"
                      value={ttsPitch}
                      onChange={(e) => updateTtsSettings({ ttsPitch: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      <div className="text-xs text-gray-500">
        <span className="font-semibold">Shortcuts:</span> Space = Start/Stop, N = Skip/Next
      </div>
    </div>
  );
}
