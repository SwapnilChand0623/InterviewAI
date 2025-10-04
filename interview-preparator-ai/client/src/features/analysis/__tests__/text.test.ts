/**
 * Unit tests for text analysis
 * 
 * To run tests, install a test framework:
 * npm install -D vitest @testing-library/react
 * 
 * Then add to package.json scripts:
 * "test": "vitest"
 */

import { describe, it, expect } from 'vitest';
import {
  countWords,
  countFillerWords,
  calculateWPM,
  ratePace,
  analyzeText,
} from '../text';

describe('Text Analysis', () => {
  describe('countWords', () => {
    it('should count words correctly', () => {
      expect(countWords('Hello world')).toBe(2);
      expect(countWords('This is a test sentence')).toBe(5);
      expect(countWords('')).toBe(0);
      expect(countWords('   ')).toBe(0);
    });

    it('should handle multiple spaces', () => {
      expect(countWords('Hello    world')).toBe(2);
    });
  });

  describe('countFillerWords', () => {
    it('should detect filler words', () => {
      const text = 'Um, I think, like, you know, this is good';
      const fillers = countFillerWords(text);
      
      expect(fillers.get('um')).toBe(1);
      expect(fillers.get('like')).toBe(1);
      expect(fillers.get('you know')).toBe(1);
    });

    it('should be case insensitive', () => {
      const text = 'UM, Um, uM';
      const fillers = countFillerWords(text);
      
      expect(fillers.get('um')).toBe(3);
    });

    it('should match whole words only', () => {
      const text = 'umbrella is not a filler';
      const fillers = countFillerWords(text);
      
      expect(fillers.has('um')).toBe(false);
    });
  });

  describe('calculateWPM', () => {
    it('should calculate WPM correctly', () => {
      expect(calculateWPM(120, 60)).toBe(120); // 120 words in 60 seconds = 120 wpm
      expect(calculateWPM(60, 120)).toBe(30);  // 60 words in 120 seconds = 30 wpm
      expect(calculateWPM(0, 60)).toBe(0);
    });

    it('should handle zero duration', () => {
      expect(calculateWPM(100, 0)).toBe(0);
    });
  });

  describe('ratePace', () => {
    it('should rate pace correctly', () => {
      expect(ratePace(100)).toBe('slow');
      expect(ratePace(130)).toBe('good');
      expect(ratePace(160)).toBe('fast');
    });

    it('should handle boundary cases', () => {
      expect(ratePace(110)).toBe('good');
      expect(ratePace(150)).toBe('good');
      expect(ratePace(109)).toBe('slow');
      expect(ratePace(151)).toBe('fast');
    });
  });

  describe('analyzeText', () => {
    it('should provide complete analysis', () => {
      const transcript = 'Um, in my previous role, like, I worked on a project. You know, it was challenging.';
      const duration = 30; // 30 seconds
      
      const metrics = analyzeText(transcript, duration);
      
      expect(metrics.wordCount).toBeGreaterThan(0);
      expect(metrics.wpm).toBeGreaterThan(0);
      expect(metrics.fillerCount).toBeGreaterThan(0);
      expect(metrics.paceRating).toBeDefined();
      expect(metrics.fillerWords).toBeInstanceOf(Array);
    });

    it('should handle empty transcript', () => {
      const metrics = analyzeText('', 60);
      
      expect(metrics.wordCount).toBe(0);
      expect(metrics.fillerCount).toBe(0);
      expect(metrics.wpm).toBe(0);
    });
  });
});
