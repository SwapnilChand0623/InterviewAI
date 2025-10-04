/**
 * Recording control buttons
 */

interface RecorderControlsProps {
  isRecording: boolean;
  isDisabled?: boolean;
  onStart: () => void;
  onStop: () => void;
  className?: string;
}

export function RecorderControls({
  isRecording,
  isDisabled = false,
  onStart,
  onStop,
  className = '',
}: RecorderControlsProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {!isRecording ? (
        <button
          onClick={onStart}
          disabled={isDisabled}
          className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="Start recording"
        >
          Start Recording
        </button>
      ) : (
        <button
          onClick={onStop}
          className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          aria-label="Stop recording"
        >
          Stop Recording
        </button>
      )}

      {isRecording && (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-gray-700">
            Recording in progress
          </span>
        </div>
      )}
    </div>
  );
}
