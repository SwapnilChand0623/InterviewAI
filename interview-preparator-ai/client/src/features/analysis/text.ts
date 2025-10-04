/**
 * Text analysis utilities for measuring speaking pace, filler words, etc.
 */

export const FILLER_WORDS = [
  'um',
  'uh',
  'like',
  'you know',
  'sort of',
  'kind of',
  'i mean',
  'basically',
  'actually',
  'literally',
  'right',
  'so',
];

export interface TextMetrics {
  wordCount: number;
  wpm: number;
  fillerCount: number;
  fillerRate: number; // fillers per minute
  paceRating: 'slow' | 'good' | 'fast';
  fillerWords: { word: string; count: number }[];
}

/**
 * Count words in text
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter((word) => word.length > 0).length;
}

/**
 * Count filler words in transcript
 */
export function countFillerWords(text: string): Map<string, number> {
  const lowerText = text.toLowerCase();
  const fillerMap = new Map<string, number>();

  for (const filler of FILLER_WORDS) {
    // Use word boundaries to match whole words/phrases
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = lowerText.match(regex);
    const count = matches ? matches.length : 0;
    if (count > 0) {
      fillerMap.set(filler, count);
    }
  }

  return fillerMap;
}

/**
 * Calculate speaking pace (words per minute)
 */
export function calculateWPM(wordCount: number, durationSeconds: number): number {
  if (durationSeconds === 0) return 0;
  const minutes = durationSeconds / 60;
  return Math.round(wordCount / minutes);
}

/**
 * Rate speaking pace based on WPM
 * Target range: 110-150 wpm for interview responses
 */
export function ratePace(wpm: number): 'slow' | 'good' | 'fast' {
  if (wpm < 110) return 'slow';
  if (wpm > 150) return 'fast';
  return 'good';
}

/**
 * Analyze text transcript for speaking metrics
 */
export function analyzeText(transcript: string, durationSeconds: number): TextMetrics {
  const wordCount = countWords(transcript);
  const wpm = calculateWPM(wordCount, durationSeconds);
  const fillerMap = countFillerWords(transcript);

  const fillerCount = Array.from(fillerMap.values()).reduce((sum, count) => sum + count, 0);
  const fillerRate = durationSeconds > 0 ? (fillerCount / durationSeconds) * 60 : 0;

  const fillerWords = Array.from(fillerMap.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count);

  return {
    wordCount,
    wpm,
    fillerCount,
    fillerRate,
    paceRating: ratePace(wpm),
    fillerWords,
  };
}

/**
 * Get suggestions based on text metrics
 */
export function getTextSuggestions(metrics: TextMetrics): string[] {
  const suggestions: string[] = [];

  if (metrics.paceRating === 'slow') {
    suggestions.push('Try speaking a bit faster. Aim for 110-150 words per minute.');
  } else if (metrics.paceRating === 'fast') {
    suggestions.push('Slow down slightly. You may be rushing. Aim for 110-150 wpm.');
  }

  if (metrics.fillerRate > 5) {
    suggestions.push(
      `Reduce filler words (${metrics.fillerCount} detected). Pause instead of using fillers.`
    );
  } else if (metrics.fillerRate > 2) {
    suggestions.push('Good job keeping filler words low. Try to eliminate a few more.');
  }

  if (metrics.wordCount < 50) {
    suggestions.push('Your answer was quite brief. Try to provide more detail and examples.');
  }

  return suggestions;
}
