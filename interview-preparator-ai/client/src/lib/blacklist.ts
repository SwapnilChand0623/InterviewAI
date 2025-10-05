/**
 * Off-topic indicators and blacklisted phrases
 */

/**
 * Phrases that strongly indicate off-topic or non-answer responses
 */
export const OFF_TOPIC_PHRASES = [
  "i don't know",
  "i'm not sure",
  "no idea",
  "can't remember",
  "don't recall",
  "never heard of",
  "not familiar",
  "don't understand the question",
  "skip this",
  "pass on this",
  "next question",
];

/**
 * Common completely unrelated topics
 */
export const UNRELATED_TOPICS = [
  'football',
  'basketball',
  'soccer',
  'sports',
  'shopping',
  'cooking',
  'recipe',
  'vacation',
  'holiday',
  'movie',
  'film',
  'music',
  'song',
  'weather',
  'restaurant',
  'food',
  'game',
  'gaming',
];

/**
 * Vague filler phrases that don't add content
 */
export const VAGUE_PHRASES = [
  'you know',
  'like i said',
  'kind of',
  'sort of',
  'i guess',
  'maybe',
  'probably',
  'i think',
  'basically',
  'actually',
];

/**
 * Check if transcript contains off-topic indicators
 * Returns count and matched phrases
 */
export function detectOffTopicMarkers(transcript: string): {
  count: number;
  matches: string[];
} {
  const lowerText = transcript.toLowerCase();
  const matches: string[] = [];

  // Check off-topic phrases
  for (const phrase of OFF_TOPIC_PHRASES) {
    if (lowerText.includes(phrase)) {
      matches.push(phrase);
    }
  }

  // Check unrelated topics
  for (const topic of UNRELATED_TOPICS) {
    const regex = new RegExp(`\\b${topic}\\b`, 'i');
    if (regex.test(lowerText)) {
      matches.push(topic);
    }
  }

  return {
    count: matches.length,
    matches,
  };
}

/**
 * Calculate vagueness score (0-100, higher = more vague)
 */
export function calculateVagueness(transcript: string): number {
  const lowerText = transcript.toLowerCase();
  const wordCount = transcript.split(/\s+/).length;
  
  if (wordCount === 0) return 100;

  let vagueCount = 0;
  for (const phrase of VAGUE_PHRASES) {
    const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      vagueCount += matches.length;
    }
  }

  // Normalize to 0-100 scale (more than 10% vague phrases = high vagueness)
  const vaguenessRatio = vagueCount / wordCount;
  return Math.min(Math.round(vaguenessRatio * 1000), 100);
}
