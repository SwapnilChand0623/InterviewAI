/**
 * Test setup file
 * Install vitest to use: npm install -D vitest @vitest/ui jsdom
 */

// Mock Web APIs that don't exist in test environment
global.MediaStream = class MediaStream {} as any;
global.MediaRecorder = class MediaRecorder {} as any;

// Mock SpeechRecognition
(global as any).SpeechRecognition = class SpeechRecognition {};
(global as any).webkitSpeechRecognition = class webkitSpeechRecognition {};

// Mock navigator.mediaDevices
Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    getUserMedia: async () => new MediaStream(),
  },
  writable: true,
});
