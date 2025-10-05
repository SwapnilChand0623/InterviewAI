/**
 * Answer relevance and correctness scoring
 */

import {
  getKeywordsForRole,
  getRelatedTerms,
  extractQuestionKeywords,
  STOPWORDS,
} from '@/lib/keywords';
import { detectOffTopicMarkers, calculateVagueness } from '@/lib/blacklist';

export type RelevanceVerdict = 'on_topic' | 'partially_on_topic' | 'off_topic';

export interface RelevanceResult {
  score: number; // 0-100
  verdict: RelevanceVerdict;
  reasons: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
}

export interface RelevanceInput {
  transcript: string;
  role: string;
  skill: string;
  question: string;
  domainKeywords?: string[];
}

/**
 * Normalize and tokenize text
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOPWORDS.has(word));
}

/**
 * Calculate keyword coverage score
 */
function calculateKeywordCoverage(
  transcriptTokens: string[],
  importantKeywords: string[]
): {
  matched: string[];
  missing: string[];
  score: number;
} {
  const transcriptSet = new Set(transcriptTokens);
  const matched: string[] = [];
  const missing: string[] = [];

  for (const keyword of importantKeywords) {
    const keywordTokens = keyword.toLowerCase().split(/\s+/);
    
    // Check if all tokens of the keyword appear in transcript
    const allFound = keywordTokens.every(token => transcriptSet.has(token));
    
    if (allFound) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  }

  const coverage = importantKeywords.length > 0
    ? matched.length / importantKeywords.length
    : 0;

  return {
    matched,
    missing,
    score: Math.round(coverage * 100),
  };
}

/**
 * Calculate semantic relatedness bonus
 */
function calculateSemanticBonus(
  transcriptTokens: string[],
  roleSkill: string
): number {
  const relatedGroups = getRelatedTerms(roleSkill);
  const transcriptSet = new Set(transcriptTokens);
  
  let bonus = 0;
  
  for (const group of relatedGroups) {
    // Count how many terms from this group appear
    const foundInGroup = group.filter(term => 
      transcriptSet.has(term.toLowerCase().replace(/\s+/g, ''))
    ).length;
    
    // Bonus for having multiple related terms
    if (foundInGroup >= 2) {
      bonus += 5;
    } else if (foundInGroup === 1) {
      bonus += 2;
    }
  }
  
  return Math.min(bonus, 20); // Cap at 20 points
}

/**
 * Score answer relevance using local heuristics
 */
export function scoreRelevanceLocal(input: RelevanceInput): RelevanceResult {
  const { transcript, role, skill, question, domainKeywords = [] } = input;

  // Tokenize transcript
  const transcriptTokens = tokenize(transcript);
  
  // Build important keyword set
  const roleKeywords = getKeywordsForRole(role);
  const questionKeywords = extractQuestionKeywords(question);
  const allImportantKeywords = [
    ...new Set([...roleKeywords.slice(0, 15), ...questionKeywords, ...domainKeywords])
  ];

  // Calculate keyword coverage
  const coverage = calculateKeywordCoverage(transcriptTokens, allImportantKeywords);

  // Calculate semantic bonus
  const semanticBonus = calculateSemanticBonus(transcriptTokens, role);

  // Check for off-topic markers
  const offTopicCheck = detectOffTopicMarkers(transcript);
  const offTopicPenalty = offTopicCheck.count * 15; // -15 per marker

  // Calculate vagueness penalty
  const vagueness = calculateVagueness(transcript);
  const vaguePenalty = Math.round(vagueness * 0.3); // Scale down

  // Calculate base score
  let score = coverage.score + semanticBonus - offTopicPenalty - vaguePenalty;
  score = Math.max(0, Math.min(100, score));

  // Determine verdict
  let verdict: RelevanceVerdict;
  if (score >= 70) {
    verdict = 'on_topic';
  } else if (score >= 40) {
    verdict = 'partially_on_topic';
  } else {
    verdict = 'off_topic';
  }

  // Generate reasons
  const reasons: string[] = [];
  
  if (coverage.score < 30) {
    reasons.push(`Low keyword coverage (${coverage.score}%). Answer may not address the question.`);
  }
  
  if (coverage.missing.length > 5) {
    reasons.push(`Missing key ${skill} concepts: ${coverage.missing.slice(0, 3).join(', ')}.`);
  }
  
  if (offTopicCheck.count > 0) {
    reasons.push(`Contains off-topic markers: "${offTopicCheck.matches[0]}".`);
  }
  
  if (vagueness > 30) {
    reasons.push('Answer contains excessive vague phrases. Be more specific.');
  }
  
  if (semanticBonus > 10) {
    reasons.push('Good use of related technical terms.');
  }
  
  if (coverage.score >= 70) {
    reasons.push(`Strong keyword coverage (${coverage.score}%). Well-aligned with question.`);
  }

  if (reasons.length === 0) {
    reasons.push('Answer shows moderate relevance. Consider adding more specific details.');
  }

  return {
    score,
    verdict,
    reasons,
    matchedKeywords: coverage.matched.slice(0, 10),
    missingKeywords: coverage.missing.slice(0, 10),
  };
}

/**
 * Score answer relevance using remote API
 */
export async function scoreRelevanceRemote(input: RelevanceInput): Promise<RelevanceResult> {
  const apiUrl = import.meta.env.API_BASE_URL || 'http://localhost:3001';
  
  try {
    const response = await fetch(`${apiUrl}/api/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    
    // Map API response to RelevanceResult format
    return {
      score: data.score || data.overall || 0,
      verdict: data.verdict || (data.score >= 70 ? 'on_topic' : data.score >= 40 ? 'partially_on_topic' : 'off_topic'),
      reasons: data.reasons || data.suggestions || [],
      matchedKeywords: data.matchedKeywords || [],
      missingKeywords: data.missingKeywords || [],
    };
  } catch (error) {
    console.warn('Remote scoring failed, falling back to local:', error);
    return scoreRelevanceLocal(input);
  }
}

/**
 * Score relevance (chooses remote or local based on config)
 */
export async function scoreRelevance(input: RelevanceInput): Promise<RelevanceResult> {
  const useBackend = import.meta.env.VITE_USE_BACKEND === 'true';
  
  if (useBackend) {
    return await scoreRelevanceRemote(input);
  }
  
  return scoreRelevanceLocal(input);
}
