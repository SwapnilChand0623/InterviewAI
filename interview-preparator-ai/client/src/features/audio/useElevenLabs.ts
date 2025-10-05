import { useState, useCallback, useRef } from 'react';

export const VOICES = {
  'Rachel': '21m00Tcm4TlvDq8ikWAM',
  'Drew': '29vD33N1CtxCmqQRPOHJ',
  'Clyde': '2EiwWnXFnvU5JabPnv8n',
  'Paul': '5Q0t7uMcjvnagumLfvZi',
  'Domi': 'AZnzlk1XvdvUeBnXmlld',
  'Dave': 'CYw3kZ02Hs0563khs1Fj',
  'Fin': 'D38z5RcWu1voky8WS1ja',
  'Sarah': 'EXAVITQu4vr4xnSDxMaL',
  'Antoni': 'ErXwobaYiN019PkySvjV',
  'Thomas': 'GBv7mTt0atIp3Br8iCZE',
} as const;

interface ElevenLabsState {
  isLoading: boolean;
  isPlaying: boolean;
  isSupported: boolean;
  error: string | null;
  currentAudio: HTMLAudioElement | null;
}

interface ElevenLabsControls {
  speak: (text: string) => Promise<void>;
  stop: () => void;
  setVoice: (voiceId: string) => void;
  testConnection: () => Promise<boolean>;
}

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech';

export const useElevenLabs = (apiKey?: string): [ElevenLabsState, ElevenLabsControls] => {
  const [state, setState] = useState<ElevenLabsState>({
    isLoading: false,
    isPlaying: false,
    isSupported: typeof Audio !== 'undefined' && typeof fetch !== 'undefined',
    error: null,
    currentAudio: null,
  });

  const [currentVoice, setCurrentVoice] = useState<string>(VOICES.Rachel);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setState(prev => ({ ...prev, isPlaying: false, currentAudio: null }));
  }, []);

  const testConnection = useCallback(async (): Promise<boolean> => {
    if (!apiKey) {
      setState(prev => ({ ...prev, error: 'API key is required' }));
      return false;
    }

    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': apiKey,
        },
      });

      if (response.ok) {
        setState(prev => ({ ...prev, error: null }));
        return true;
      } else {
        const errorText = await response.text();
        setState(prev => ({ ...prev, error: `API Error: ${response.status} - ${errorText}` }));
        return false;
      }
    } catch (error) {
      setState(prev => ({ ...prev, error: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` }));
      return false;
    }
  }, [apiKey]);

  const speak = useCallback(async (text: string): Promise<void> => {
    if (!apiKey) {
      setState(prev => ({ ...prev, error: 'API key is required' }));
      return;
    }

    if (!state.isSupported) {
      setState(prev => ({ ...prev, error: 'Browser does not support required audio features' }));
      return;
    }

    // Stop any current audio
    stop();

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log('Making TTS request with:', { text: text.substring(0, 50) + '...', voice: currentVoice });

      const response = await fetch(`${ELEVENLABS_API_URL}/${currentVoice}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ElevenLabs API Error:', response.status, errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const audioBlob = await response.blob();
      console.log('Received audio blob:', audioBlob.size, 'bytes');

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audioRef.current = audio;

      // Set up event listeners
      audio.onloadeddata = () => {
        console.log('Audio loaded successfully');
        setState(prev => ({ ...prev, isLoading: false, currentAudio: audio }));
      };

      audio.onplay = () => {
        console.log('Audio started playing');
        setState(prev => ({ ...prev, isPlaying: true }));
      };

      audio.onended = () => {
        console.log('Audio finished playing');
        URL.revokeObjectURL(audioUrl);
        setState(prev => ({ ...prev, isPlaying: false, currentAudio: null }));
        audioRef.current = null;
      };

      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        URL.revokeObjectURL(audioUrl);
        setState(prev => ({ ...prev, isLoading: false, isPlaying: false, error: 'Audio playback failed', currentAudio: null }));
        audioRef.current = null;
      };

      // Start playing
      try {
        await audio.play();
      } catch (playError) {
        console.error('Play error:', playError);
        throw new Error(`Playback failed: ${playError instanceof Error ? playError.message : 'Unknown error'}`);
      }

    } catch (error) {
      console.error('TTS Error:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        isPlaying: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        currentAudio: null 
      }));
    }
  }, [apiKey, currentVoice, state.isSupported, stop]);

  const setVoice = useCallback((voiceId: string) => {
    setCurrentVoice(voiceId);
  }, []);

  return [
    state,
    {
      speak,
      stop,
      setVoice,
      testConnection,
    },
  ];
};
