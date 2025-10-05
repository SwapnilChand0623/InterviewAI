/**
 * Hook for Web Speech Recognition API with auto-end detection
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { getSpeechRecognition } from '@/lib/utils';

export interface SpeechState {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  isSupported: boolean;
  error: string | null;
}

export interface SpeechControls {
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  cancelAutoEnd: () => void;
}

interface UseSpeechOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onTranscriptUpdate?: (transcript: string) => void;
  onAutoEnd?: () => void;
  onPartialUpdate?: (text: string) => void;
  minSpeakMs?: number; // Minimum speech duration before silence can trigger end (default: 8000)
  silenceMs?: number;   // Silence duration to trigger auto-end (default: 3200)
}

/**
 * Wrap-up phrases that indicate answer is ending
 */
const WRAPUP_PHRASES = [
  'in summary',
  'to summarize',
  "that's all",
  "that's it",
  'in conclusion',
  'to conclude',
  'finally',
  'so yeah',
  'and yeah',
  'so that is',
  'so that was',
];

/**
 * Detect if text ends with a wrap-up phrase
 */
function detectWrapUpPhrase(text: string): boolean {
  const lowerText = text.toLowerCase().trim();
  return WRAPUP_PHRASES.some(phrase => lowerText.includes(phrase));
}

/**
 * Hook for managing Speech Recognition
 */
export function useSpeech(options: UseSpeechOptions = {}): [SpeechState, SpeechControls] {
  const {
    language = 'en-US',
    continuous = true,
    interimResults = true,
    onTranscriptUpdate,
    onAutoEnd,
    onPartialUpdate,
    minSpeakMs = 8000,
    silenceMs = 3200,
  } = options;

  const SpeechRecognitionClass = getSpeechRecognition();
  const isSupported = !!SpeechRecognitionClass;

  const [state, setState] = useState<SpeechState>({
    transcript: '',
    interimTranscript: '',
    isListening: false,
    isSupported,
    error: null,
  });

  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef<string>('');
  const lastWordTimeRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const silenceTimerRef = useRef<number | null>(null);
  const wrapUpTimerRef = useRef<number | null>(null);
  const onAutoEndRef = useRef(onAutoEnd);
  const onPartialUpdateRef = useRef(onPartialUpdate);
  const lastAutoEndAttemptRef = useRef<number>(0);
  const manualActionTimeRef = useRef<number>(0);

  // Keep refs up to date
  useEffect(() => {
    onAutoEndRef.current = onAutoEnd;
    onPartialUpdateRef.current = onPartialUpdate;
  }, [onAutoEnd, onPartialUpdate]);

  // Initialize recognition
  useEffect(() => {
    if (!SpeechRecognitionClass) return;

    const recognition = new SpeechRecognitionClass();
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = language;

    recognition.onstart = () => {
      setState((prev) => ({ ...prev, isListening: true, error: null }));
      startTimeRef.current = Date.now();
      lastWordTimeRef.current = Date.now();
    };

    recognition.onend = () => {
      setState((prev) => ({ ...prev, isListening: false }));
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (wrapUpTimerRef.current) {
        clearTimeout(wrapUpTimerRef.current);
      }
    };

    recognition.onerror = (event: any) => {
      let errorMessage = 'Speech recognition error';
      
      if (event.error === 'no-speech') {
        errorMessage = 'No speech detected';
      } else if (event.error === 'audio-capture') {
        errorMessage = 'Microphone not found';
      } else if (event.error === 'not-allowed') {
        errorMessage = 'Microphone permission denied';
      }

      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isListening: false,
      }));
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let newFinalChunks = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcriptPiece = result[0].transcript;

        if (result.isFinal) {
          newFinalChunks += transcriptPiece + ' ';
          lastWordTimeRef.current = Date.now(); // Update on final results
        } else {
          interimTranscript += transcriptPiece;
        }
      }

      // Update local ref for full text
      finalTranscriptRef.current += newFinalChunks;
      const fullFinalTranscript = finalTranscriptRef.current;

      setState((prev) => ({
        ...prev,
        transcript: fullFinalTranscript.trim(),
        interimTranscript: interimTranscript.trim(),
      }));

      // Call onTranscriptUpdate with new final chunks (for store buffer)
      if (onTranscriptUpdate && newFinalChunks) {
        onTranscriptUpdate(newFinalChunks.trim());
      }

      if (onPartialUpdateRef.current) {
        onPartialUpdateRef.current(fullFinalTranscript.trim() + ' ' + interimTranscript);
      }

      // Clear existing timers
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (wrapUpTimerRef.current) {
        clearTimeout(wrapUpTimerRef.current);
      }

      // Check for wrap-up phrases
      const fullText = (fullFinalTranscript + ' ' + interimTranscript).trim();
      if (detectWrapUpPhrase(fullText)) {
        // Arm wrap-up timer (shorter timeout)
        wrapUpTimerRef.current = window.setTimeout(() => {
          const elapsed = Date.now() - startTimeRef.current;
          const now = Date.now();
          const timeSinceManualAction = now - manualActionTimeRef.current;
          const timeSinceLastAutoEnd = now - lastAutoEndAttemptRef.current;
          
          // Debounce: only fire if 1.5s since last attempt and 500ms since manual action
          if (
            elapsed >= minSpeakMs &&
            timeSinceManualAction >= 500 &&
            timeSinceLastAutoEnd >= 1500 &&
            onAutoEndRef.current
          ) {
            lastAutoEndAttemptRef.current = now;
            onAutoEndRef.current();
          }
        }, 1200); // Slightly longer for wrap-up
      } else {
        // Normal silence detection
        silenceTimerRef.current = window.setTimeout(() => {
          const elapsed = Date.now() - startTimeRef.current;
          const timeSinceLastWord = Date.now() - lastWordTimeRef.current;
          const now = Date.now();
          const timeSinceManualAction = now - manualActionTimeRef.current;
          const timeSinceLastAutoEnd = now - lastAutoEndAttemptRef.current;
          
          // Debounce: only fire if 1.5s since last attempt and 500ms since manual action
          if (
            elapsed >= minSpeakMs &&
            timeSinceLastWord >= silenceMs &&
            timeSinceManualAction >= 500 &&
            timeSinceLastAutoEnd >= 1500 &&
            onAutoEndRef.current
          ) {
            lastAutoEndAttemptRef.current = now;
            onAutoEndRef.current();
          }
        }, silenceMs);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (wrapUpTimerRef.current) {
        clearTimeout(wrapUpTimerRef.current);
      }
    };
  }, [SpeechRecognitionClass, continuous, interimResults, language, onTranscriptUpdate, minSpeakMs, silenceMs]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setState((prev) => ({
        ...prev,
        error: 'Speech recognition not supported in this browser',
      }));
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (err) {
      // Already running, ignore
      console.warn('Speech recognition already started');
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    // Mark manual action to prevent auto-end
    manualActionTimeRef.current = Date.now();
  }, []);

  const resetTranscript = useCallback(() => {
    finalTranscriptRef.current = '';
    setState((prev) => ({
      ...prev,
      transcript: '',
      interimTranscript: '',
    }));
    // Mark manual action
    manualActionTimeRef.current = Date.now();
  }, []);
  
  // Expose method to cancel auto-end (for skip/manual actions)
  const cancelAutoEnd = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (wrapUpTimerRef.current) {
      clearTimeout(wrapUpTimerRef.current);
      wrapUpTimerRef.current = null;
    }
    manualActionTimeRef.current = Date.now();
  }, []);

  return [
    state,
    {
      startListening,
      stopListening,
      resetTranscript,
      cancelAutoEnd,
    },
  ];
}

/**
 * Fallback: transcribe audio blob via backend API
 */
export async function transcribeBlob(audioBlob: Blob, apiUrl: string): Promise<string> {
  const formData = new FormData();
  formData.append('audio', audioBlob);

  const response = await fetch(`${apiUrl}/api/transcribe`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Transcription failed');
  }

  const data = await response.json();
  return data.transcript || '';
}
