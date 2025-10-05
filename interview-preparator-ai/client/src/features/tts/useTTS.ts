/**
 * Text-to-Speech hook using Web Speech Synthesis API
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export type TTSEvents = {
  onstart?: () => void;
  onend?: () => void;
  onerror?: (e: any) => void;
};

export type TTSOptions = {
  voiceName?: string;
  rate?: number;
  pitch?: number;
};

export function useTTS() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check browser support
  useEffect(() => {
    const supported = 'speechSynthesis' in window;
    setIsSupported(supported);

    if (supported) {
      // Load voices
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      
      // Chrome requires waiting for voices to load
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }

    return () => {
      if (supported) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback(
    (text: string, opts?: TTSOptions, ev?: TTSEvents) => {
      if (!isSupported) {
        console.warn('Speech synthesis not supported');
        return;
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      currentUtteranceRef.current = utterance;
      
      console.log('[TTS] Speaking:', text.substring(0, 50) + '...');

      // Apply options
      if (opts?.rate !== undefined) {
        utterance.rate = opts.rate;
      }
      if (opts?.pitch !== undefined) {
        utterance.pitch = opts.pitch;
      }
      if (opts?.voiceName) {
        const voice = voices.find((v) => v.name === opts.voiceName);
        if (voice) {
          utterance.voice = voice;
        }
      }

      // Set up event handlers
      utterance.onstart = () => {
        setIsSpeaking(true);
        ev?.onstart?.();
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
        ev?.onend?.();
      };

      utterance.onerror = (e) => {
        setIsSpeaking(false);
        currentUtteranceRef.current = null;
        console.error('Speech synthesis error:', e);
        ev?.onerror?.(e);
        
        // Fallback: call onend even on error to resume flow
        ev?.onend?.();
      };

      // Start speaking
      window.speechSynthesis.speak(utterance);
    },
    [isSupported, voices]
  );

  const cancel = useCallback(() => {
    if (!isSupported) return;
    
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    currentUtteranceRef.current = null;
  }, [isSupported]);

  return {
    speak,
    cancel,
    isSupported,
    isSpeaking,
    voices,
  };
}
