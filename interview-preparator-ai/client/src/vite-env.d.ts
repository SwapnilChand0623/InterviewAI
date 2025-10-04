/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_BACKEND: string;
  readonly API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Extend window for speech recognition
interface Window {
  SpeechRecognition: typeof SpeechRecognition;
  webkitSpeechRecognition: typeof SpeechRecognition;
}
