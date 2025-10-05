/**
 * Answer relevance and correctness scoring
 */

import {
  getRequiredKeywords,
  getSynonyms,
  stem,
  STOPWORDS,
} from '@/lib/keywords';
import { detectOffTopicMarkers, calculateVagueness } from '@/lib/blacklist';
import { calculateSemanticSimilarity } from './text';
import { analyzeSTAR } from './star';

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
 * Calculate keyword coverage score with synonym and stemming support
 */
function calculateKeywordCoverage(
  transcriptTokens: string[],
  importantKeywords: string[],
  roleSkill: string
): {
  matched: string[];
  missing: string[];
  score: number;
} {
  const transcriptSet = new Set(transcriptTokens);
  const transcriptStemmed = new Set(transcriptTokens.map(stem));
  const matched: string[] = [];
  const missing: string[] = [];

  for (const keyword of importantKeywords) {
    const keywordTokens = keyword.toLowerCase().split(/\s+/);
    let found = false;
    
    // 1. Check exact match
    const exactMatch = keywordTokens.every(token => transcriptSet.has(token));
    if (exactMatch) {
      matched.push(keyword);
      found = true;
      continue;
    }
    
    // 2. Check stemmed match
    const stemmedMatch = keywordTokens.every(token => transcriptStemmed.has(stem(token)));
    if (stemmedMatch) {
      matched.push(keyword);
      found = true;
      continue;
    }
    
    // 3. Check synonym match
    const synonyms = getSynonyms(keyword, roleSkill);
    for (const syn of synonyms) {
      const synTokens = syn.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/);
      const synMatch = synTokens.every(token => 
        transcriptSet.has(token) || transcriptStemmed.has(stem(token))
      );
      if (synMatch) {
        matched.push(keyword);
        found = true;
        break;
      }
    }
    
    if (!found) {
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
 * Score answer relevance using hybrid local heuristics
 * Implements: 0.5 * semantic + 0.5 * keyword + STAR bonus (up to +15) + high STAR boost (up to +20) + keyword boost (+5)
 * High STAR boost: 3+ components ≥75 = +20, 2 components ≥75 = +15, avg ≥70 = +10
 * Thresholds: on_topic ≥60, partial 40-59, off_topic <40
 */
export function scoreRelevanceLocal(input: RelevanceInput): RelevanceResult {
  const { transcript, role, skill, question } = input;

  // Tokenize transcript
  const transcriptTokens = tokenize(transcript);
  const wordCount = transcriptTokens.length;
  
  // Minimum length guard - if < 10 words, cap at partial
  if (wordCount < 10) {
    return {
      score: 40,
      verdict: 'partially_on_topic',
      reasons: ['Answer is too short to judge properly. Provide more details (at least 10 words).'],
      matchedKeywords: [],
      missingKeywords: getRequiredKeywords(question, role),
    };
  }
  
  // 1. SEMANTIC SIMILARITY (0.6 weight)
  const semanticScore = calculateSemanticSimilarity(transcript, question);
  
  // 2. KEYWORD COVERAGE (0.4 weight)
  const allImportantKeywords = getRequiredKeywords(question, role);
  const coverage = calculateKeywordCoverage(transcriptTokens, allImportantKeywords, role);
  const keywordScore = coverage.score;
  
  // 3. STAR BONUS (0 to +15) + HIGH STAR BOOST
  const starAnalysis = analyzeSTAR(transcript);
  const starComponents = [starAnalysis.scores.T, starAnalysis.scores.A, starAnalysis.scores.R];
  const starPresent = starComponents.filter(s => s > 50).length;
  let starBonus = Math.min(starPresent * 5, 15); // 5 points per clear T/A/R component, max 15
  
  // HIGH STAR AUTO-BOOST: If most STAR components are 75+, answer is well-structured
  const highStarCount = starComponents.filter(s => s >= 75).length;
  const avgStarScore = (starAnalysis.scores.S + starAnalysis.scores.T + starAnalysis.scores.A + starAnalysis.scores.R) / 4;
  
  let highStarBoost = 0;
  if (highStarCount >= 3) {
    // 3+ components at 75+ = excellent structure, boost heavily
    highStarBoost = 20;
  } else if (highStarCount === 2 && avgStarScore >= 60) {
    // 2 components at 75+ and good average = strong structure
    highStarBoost = 15;
  } else if (avgStarScore >= 70) {
    // Overall strong STAR = good structure
    highStarBoost = 10;
  }
  
  // 4. PENALTIES (capped)
  const offTopicCheck = detectOffTopicMarkers(transcript);
  const offTopicPenalty = Math.min(offTopicCheck.count * 10, 10); // Cap at -10
  
  const vagueness = calculateVagueness(transcript);
  const vaguePenalty = Math.min(Math.round(vagueness * 0.2), 5); // Cap at -5
  
  // 5. CALCULATE HYBRID SCORE
  // Balanced weighting: semantic and keywords equally important
  const baseScore = (0.5 * semanticScore) + (0.5 * keywordScore);
  
  // Boost if keywords are strong (means technically correct)
  const keywordBoost = keywordScore >= 50 ? 5 : 0;
  
  let finalScore = baseScore + starBonus + highStarBoost + keywordBoost - offTopicPenalty - vaguePenalty;
  finalScore = Math.round(Math.max(0, Math.min(100, finalScore)));
  
  // If answer is >= 40 words, don't auto-downgrade to partial based on length alone
  if (wordCount >= 40 && finalScore >= 45) {
    // Acceptable length, trust the score
  }
  
  // 6. DETERMINE VERDICT (adjusted thresholds for technical correctness)
  let verdict: RelevanceVerdict;
  if (finalScore >= 60) {
    verdict = 'on_topic';
  } else if (finalScore >= 40) {
    verdict = 'partially_on_topic';
  } else {
    verdict = 'off_topic';
  }
  
  // 7. GENERATE REASONS
  const reasons: string[] = [];
  
  if (semanticScore < 30) {
    reasons.push(`Low semantic similarity (${semanticScore}%). Answer may not address the question directly.`);
  }
  
  if (keywordScore < 25) {
    reasons.push(`Missing key ${skill} terms (${coverage.missing.slice(0, 3).join(', ')}).`);
  }
  
  if (starBonus > 0) {
    reasons.push(`Good structure! Detected ${starPresent} STAR component(s) (Task/Action/Result).`);
  }
  
  if (highStarBoost > 0) {
    reasons.push(`Excellent STAR structure! (avg: ${Math.round(avgStarScore)}) Boosted relevance by +${highStarBoost}.`);
  }
  
  if (offTopicCheck.count > 0) {
    reasons.push(`Contains uncertainty markers: "${offTopicCheck.matches[0]}".`);
  }
  
  if (vagueness > 30) {
    reasons.push('Answer is somewhat vague. Add more specific technical details.');
  }
  
  if (finalScore >= 60) {
    reasons.push(`Good answer! (semantic: ${semanticScore}, keywords: ${keywordScore}, STAR: +${starBonus})`);
  }
  
  if (reasons.length === 0) {
    reasons.push('Answer shows moderate relevance. Consider adding more specific examples.');
  }
  
  return {
    score: finalScore,
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

/**
 * Re-export getRequiredKeywords for use in other modules
 */
export { getRequiredKeywords } from '@/lib/keywords';
