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
    'in my',
    'experience',
    'worked with',
    'dealing with',
    'faced',
    'example',
    'for example',
    'for instance',
    'scenario',
    'case',
    'where',
    'when',
    'application',
    'system',
    'code',
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
    'required',
    'wanted to',
    'trying to',
    'issue',
    'difficulty',
    'need',
    'requirement',
    'asked to',
    'supposed to',
    'meant to',
    'purpose',
    'question',
    'answer',
    'explain',
    'solve',
    'handle',
    'address',
    'work',
    'working',
    'works',
    'function',
    'help',
    'let',
    'lets',
    'allow',
    'manage',
    'manages',
    'organize',
    'structure',
    'way',
    'method',
    'approach',
    'technique',
    'used for',
    'used to',
    'is',
    'are',
    'was',
    'were',
    'does',
    'do',
    'did',
    'means',
    'mean',
    'refers',
    'refers to',
    'describes',
    'describe',
    'represents',
    'represent',
    'what',
    'how',
    'why',
    'which',
    'that',
    'performs',
    'perform',
    'enables',
    'enable',
    'supports',
    'support',
    'offers',
    'offer',
    'serves',
    'serve',
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
    'i used',
    'i wrote',
    'i added',
    'i configured',
    'i set up',
    'i applied',
    'we used',
    'we implemented',
    'use',
    'using',
    'used',
    'write',
    'writing',
    'create',
    'creating',
    'make',
    'making',
    'define',
    'set',
    'call',
    'pass',
    'add',
    'install',
    'run',
    'execute',
    'deploy',
    'configure',
    'access',
    'accessing',
    'accessed',
    'get',
    'gets',
    'getting',
    'fetch',
    'fetches',
    'fetching',
    'store',
    'stores',
    'storing',
    'save',
    'saves',
    'saving',
    'load',
    'loads',
    'loading',
    'send',
    'sends',
    'sending',
    'receive',
    'receives',
    'receiving',
    'update',
    'updates',
    'updating',
    'delete',
    'deletes',
    'deleting',
    'modify',
    'modifies',
    'modifying',
    'change',
    'changes',
    'changing',
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
    'faster',
    'better',
    'solved',
    'fixed',
    'optimized',
    'enhancement',
    'finally',
    'ultimately',
    'works',
    'working',
    'allows',
    'enables',
    'ensures',
    'provides',
    'helps',
    'made',
    'makes',
    'so',
    'therefore',
    'thus',
    'now',
    'can',
    'more',
    'less',
    'efficient',
    'effective',
    'reliable',
    'maintainable',
    'easy',
    'easier',
    'simple',
    'simpler',
    'clean',
    'cleaner',
    'clear',
    'clearer',
    'benefit',
    'benefits',
    'advantage',
    'useful',
    'helpful',
    'good',
    'great',
    'best',
    'avoid',
    'avoids',
    'prevent',
    'prevents',
    'reduce',
    'reduces',
    'improve',
    'improves',
    'increase',
    'increases',
    'enhance',
    'enhances',
  ],
};

/**
 * Calculate score for a STAR component based on keyword presence
 */
function scoreComponent(text: string, keywords: string[]): number {
  const lowerText = text.toLowerCase();
  let score = 0;
  let matchCount = 0;

  for (const keyword of keywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    if (regex.test(lowerText)) {
      matchCount++;
    }
  }

  // Progressive scoring: 1 match = 40, 2 = 70, 3+ = 100
  if (matchCount === 0) score = 0;
  else if (matchCount === 1) score = 40;
  else if (matchCount === 2) score = 70;
  else score = 100;

  return score;
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
