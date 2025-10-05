/**
 * Question Reader Component with Text-to-Speech
 */

import { useState, useEffect } from 'react';

interface QuestionReaderProps {
  question: string;
  autoPlay?: boolean;
  className?: string;
}

export function QuestionReader({ 
  question, 
  autoPlay = false, 
  className = '' 
}: QuestionReaderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsSupported('speechSynthesis' in window);
  }, []);

  useEffect(() => {
    if (autoPlay && isSupported && question) {
      // Small delay to ensure component is mounted
      const timer = setTimeout(() => {
        handlePlay();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [question, autoPlay, isSupported]);

  const handlePlay = () => {
    if (!isSupported) return;

    // Stop any current speech
    window.speechSynthesis.cancel();
    setError(null);

    const utterance = new SpeechSynthesisUtterance(question);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = (event) => {
      setIsPlaying(false);
      setError(`Speech synthesis error: ${event.error}`);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  if (!isSupported) {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-3 ${className}`}>
        <p className="text-sm text-yellow-800">
          Text-to-speech is not supported in your browser.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Question Display with Glow Effect */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-lg blur-sm opacity-75 animate-pulse"></div>
        <div className="relative bg-white rounded-lg border border-blue-200 p-6 shadow-lg">
          <p className="text-lg font-medium text-gray-900 leading-relaxed">
            {question}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={handlePlay}
          disabled={isPlaying}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPlaying ? (
            <>
              <span className="text-lg">🔊</span>
              Playing...
            </>
          ) : (
            <>
              <span className="text-lg">🔊</span>
              Read Question
            </>
          )}
        </button>

        {isPlaying && (
          <button
            onClick={handleStop}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <span className="text-lg">⏹️</span>
            Stop
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">
            <span className="font-semibold">Audio Error:</span> {error}
          </p>
        </div>
      )}

      {/* Help Text */}
      <div className="bg-blue-50 rounded-lg p-3">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Tip:</span> Listen to the question being read aloud 
          for better comprehension. You can replay it anytime during your preparation.
        </p>
      </div>
    </div>
  );
}
