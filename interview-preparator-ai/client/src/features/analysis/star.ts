/**
 * STAR (Situation, Task, Action, Result) rubric analysis
 */

export interface StarScores {
  S: number; // Situation (0-100)
  T: number; // Task (0-100)
  A: number; // Action (0-100)
  R: number; // Result (0-100)
}

export interface StarAnalysis {
  scores: StarScores;
  missing: string[];
  suggestions: string[];
}

// Keywords that indicate each STAR component
const STAR_KEYWORDS = {
  S: [
    'situation',
    'context',
    'background',
    'project',
    'team',
    'working on',
    'at my company',
    'in my role',
    'previously',
    'when i was',
  ],
  T: [
    'task',
    'goal',
    'objective',
    'challenge',
    'problem',
    'needed to',
    'had to',
    'responsibility',
    'my job',
    'assigned',
  ],
  A: [
    'action',
    'did',
    'implemented',
    'created',
    'built',
    'designed',
    'developed',
    'i decided',
    'i chose',
    'i worked',
    'my approach',
    'first',
    'then',
    'next',
  ],
  R: [
    'result',
    'outcome',
    'impact',
    'achieved',
    'reduced',
    'improved',
    'increased',
    'successfully',
    'delivered',
    'saved',
    'metric',
    'percent',
    '%',
  ],
};

/**
 * Calculate score for a STAR component based on keyword presence
 */
function scoreComponent(text: string, keywords: string[]): number {
  const lowerText = text.toLowerCase();
  let score = 0;

  for (const keyword of keywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    if (regex.test(lowerText)) {
      score += 25; // Each keyword match adds 25 points (max 100)
    }
  }

  return Math.min(score, 100);
}

/**
 * Detect STAR structure with more sophisticated heuristics
 */
function detectStarStructure(text: string): StarScores {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

  // Early bonus: longer, structured answers are more likely to have STAR
  const lengthBonus = Math.min(sentences.length * 2, 20);

  const scores: StarScores = {
    S: scoreComponent(text, STAR_KEYWORDS.S),
    T: scoreComponent(text, STAR_KEYWORDS.T),
    A: scoreComponent(text, STAR_KEYWORDS.A),
    R: scoreComponent(text, STAR_KEYWORDS.R),
  };

  // Apply length bonus to all components
  scores.S = Math.min(scores.S + lengthBonus, 100);
  scores.T = Math.min(scores.T + lengthBonus, 100);
  scores.A = Math.min(scores.A + lengthBonus, 100);
  scores.R = Math.min(scores.R + lengthBonus, 100);

  return scores;
}

/**
 * Analyze transcript for STAR completeness
 */
export function analyzeSTAR(transcript: string): StarAnalysis {
  const scores = detectStarStructure(transcript);
  const missing: string[] = [];
  const suggestions: string[] = [];

  // Identify missing components (threshold: 30)
  if (scores.S < 30) {
    missing.push('Situation');
    suggestions.push(
      'Start with clear context: describe the situation, project, or environment.'
    );
  }

  if (scores.T < 30) {
    missing.push('Task');
    suggestions.push('Clarify your specific task or the challenge you faced.');
  }

  if (scores.A < 30) {
    missing.push('Action');
    suggestions.push(
      'Detail the actions YOU took. Use "I" statements and describe your process step-by-step.'
    );
  }

  if (scores.R < 30) {
    missing.push('Result');
    suggestions.push(
      'End with measurable results or outcomes. Use metrics, percentages, or concrete achievements.'
    );
  }

  // General suggestions
  if (missing.length === 0) {
    suggestions.push('Great job covering all STAR components! Keep being specific and detailed.');
  } else if (missing.length <= 2) {
    suggestions.push(
      `Good structure overall. Strengthen the ${missing.join(' and ')} sections.`
    );
  } else {
    suggestions.push(
      'Use the STAR framework: Situation → Task → Action → Result to structure your answer.'
    );
  }

  return {
    scores,
    missing,
    suggestions,
  };
}

/**
 * Get overall STAR completeness score (0-100)
 */
export function getOverallStarScore(scores: StarScores): number {
  return Math.round((scores.S + scores.T + scores.A + scores.R) / 4);
}
