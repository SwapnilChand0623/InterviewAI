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

/**
 * Semantic Similarity Utilities (lightweight, no server needed)
 */

/**
 * Extract bigrams from text
 */
function getBigrams(text: string): Set<string> {
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  const bigrams = new Set<string>();
  
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.add(`${words[i]} ${words[i + 1]}`);
  }
  
  return bigrams;
}

/**
 * Calculate Jaccard similarity between two sets
 */
function jaccardSimilarity(set1: Set<string>, set2: Set<string>): number {
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

/**
 * Token set ratio: tokenize both strings, find intersection/union
 * Similar to RapidFuzz token_set_ratio
 */
export function tokenSetRatio(str1: string, str2: string): number {
  const tokens1 = new Set(str1.toLowerCase().split(/\s+/).filter(t => t.length > 0));
  const tokens2 = new Set(str2.toLowerCase().split(/\s+/).filter(t => t.length > 0));
  
  return jaccardSimilarity(tokens1, tokens2) * 100;
}

/**
 * Partial ratio: find best matching substring
 * Simplified version of RapidFuzz partial_ratio
 */
export function partialRatio(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  if (s1.length === 0 || s2.length === 0) return 0;
  
  // If one string is contained in the other, it's a perfect match
  if (s1.includes(s2) || s2.includes(s1)) return 100;
  
  // Otherwise, use token overlap as approximation
  return tokenSetRatio(str1, str2);
}

/**
 * Bigram overlap similarity
 */
export function bigramOverlap(str1: string, str2: string): number {
  const bigrams1 = getBigrams(str1);
  const bigrams2 = getBigrams(str2);
  
  if (bigrams1.size === 0 && bigrams2.size === 0) return 100;
  if (bigrams1.size === 0 || bigrams2.size === 0) return 0;
  
  return jaccardSimilarity(bigrams1, bigrams2) * 100;
}

/**
 * Calculate semantic similarity score between transcript and question
 * Combines token set, partial, and bigram overlaps
 */
export function calculateSemanticSimilarity(transcript: string, question: string): number {
  if (!transcript.trim() || !question.trim()) return 0;
  
  const tokenScore = tokenSetRatio(transcript, question);
  const partialScore = partialRatio(transcript, question);
  const bigramScore = bigramOverlap(transcript, question);
  
  // Weighted average: token set is most important, then bigrams, then partial
  const semanticScore = (tokenScore * 0.5) + (bigramScore * 0.3) + (partialScore * 0.2);
  
  return Math.round(Math.min(100, semanticScore));
}
