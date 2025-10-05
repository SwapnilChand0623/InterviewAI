/**
 * Hook for Web Speech Recognition API
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
}

interface UseSpeechOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onTranscriptUpdate?: (transcript: string) => void;
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

  const recognitionRef = useRef<typeof SpeechRecognitionClass | null>(null);
  const finalTranscriptRef = useRef<string>('');

  // Initialize recognition
  useEffect(() => {
    if (!SpeechRecognitionClass) return;

    const recognition = new SpeechRecognitionClass();
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = language;

    recognition.onstart = () => {
      setState((prev) => ({ ...prev, isListening: true, error: null }));
    };

    recognition.onend = () => {
      setState((prev) => ({ ...prev, isListening: false }));
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
      let finalTranscript = finalTranscriptRef.current;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcriptPiece = result[0].transcript;

        if (result.isFinal) {
          finalTranscript += transcriptPiece + ' ';
        } else {
          interimTranscript += transcriptPiece;
        }
      }

      finalTranscriptRef.current = finalTranscript;

      setState((prev) => ({
        ...prev,
        transcript: finalTranscript.trim(),
        interimTranscript: interimTranscript.trim(),
      }));

      if (onTranscriptUpdate) {
        onTranscriptUpdate(finalTranscript.trim());
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [SpeechRecognitionClass, continuous, interimResults, language, onTranscriptUpdate]);

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
  }, []);

  const resetTranscript = useCallback(() => {
    finalTranscriptRef.current = '';
    setState((prev) => ({
      ...prev,
      transcript: '',
      interimTranscript: '',
    }));
  }, []);

  return [
    state,
    {
      startListening,
      stopListening,
      resetTranscript,
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
