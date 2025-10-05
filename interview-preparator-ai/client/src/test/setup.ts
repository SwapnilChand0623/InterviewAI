/**
 * Test setup file
 * Install vitest to use: npm install -D vitest @vitest/ui jsdom
 */

// Mock Web APIs that don't exist in test environment
(globalThis as any).MediaStream = class MediaStream {} as any;
(globalThis as any).MediaRecorder = class MediaRecorder {} as any;

// Mock SpeechRecognition
(globalThis as any).SpeechRecognition = class SpeechRecognition {};
(globalThis as any).webkitSpeechRecognition = class webkitSpeechRecognition {};

// Mock navigator.mediaDevices
Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    getUserMedia: async () => new (globalThis as any).MediaStream(),
  },
  writable: true,
});
