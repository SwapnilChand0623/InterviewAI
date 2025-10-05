/**
 * Types for multi-question session results and overall grading
 */

export type QuestionResult = {
  id: string;
  question: string;
  transcript: string;
  durationMs: number;
  metrics: {
    wpm: number;
    fillerCount: number;
    attentionScore: number;
    starScores: { S: number; T: number; A: number; R: number };
    relevance?: {
      score: number;
      verdict: 'on_topic' | 'partially_on_topic' | 'off_topic';
      reasons: string[];
      matchedKeywords: string[];
      missingKeywords: string[];
    };
    status?: 'answered' | 'skipped' | 'timeout';
  };
  overallScore?: number; // Composite score for this question (0-100)
  grade?: 'A' | 'B' | 'C' | 'D' | 'F'; // Letter grade for this question
};

export type SessionResults = {
  startedAt: string;
  endedAt: string;
  role: string;
  skill: string;
  questions: QuestionResult[];
  overall?: {
    score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    summary: string[];
    aggregates: {
      avgWpm: number;
      avgAttention: number;
      avgRelevance: number;
      starMean: number;
      fillerPerMin: number;
      answeredCount: number;
      skippedCount: number;
    };
  };
};
