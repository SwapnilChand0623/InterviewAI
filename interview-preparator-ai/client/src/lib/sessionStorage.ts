/**
 * Session history and persistence management
 */

import type { RoleSkill } from './questions';
import type { TextMetrics } from '@/features/analysis/text';
import type { StarScores } from '@/features/analysis/star';
import type { AttentionMetrics } from '@/features/analysis/attention';

export interface SessionAnswer {
  questionId: string;
  question: string;
  startTime: number;
  endTime: number;
  transcript: string;
  textMetrics: TextMetrics | null;
  starScores: StarScores | null;
  attentionMetrics: AttentionMetrics | null;
  rawAttention: {
    headVariance: number;
    gazeDrift: number;
  };
}

export interface CompletedSession {
  id: string;
  role: RoleSkill;
  startTime: number;
  endTime: number;
  totalDuration: number;
  answers: SessionAnswer[];
  questionCount: number;
}

export interface SessionHistory {
  sessions: CompletedSession[];
  totalSessions: number;
  totalQuestions: number;
  questionHistory: Set<string>; // Track all answered question IDs
}

const STORAGE_KEY = 'interview_ai_session_history';
const QUESTION_HISTORY_KEY = 'interview_ai_question_history';
const MAX_QUESTION_HISTORY = 50; // Keep track of last 50 questions

/**
 * Load session history from localStorage
 */
export function loadSessionHistory(): SessionHistory {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const questionData = localStorage.getItem(QUESTION_HISTORY_KEY);
    
    if (!data) {
      return {
        sessions: [],
        totalSessions: 0,
        totalQuestions: 0,
        questionHistory: new Set(),
      };
    }

    const parsed = JSON.parse(data);
    const questionHistory = questionData ? new Set<string>(JSON.parse(questionData)) : new Set<string>();

    return {
      sessions: parsed.sessions || [],
      totalSessions: parsed.totalSessions || 0,
      totalQuestions: parsed.totalQuestions || 0,
      questionHistory,
    };
  } catch (error) {
    console.error('Failed to load session history:', error);
    return {
      sessions: [],
      totalSessions: 0,
      totalQuestions: 0,
      questionHistory: new Set(),
    };
  }
}

/**
 * Save a completed session to history
 */
export function saveSession(session: CompletedSession): void {
  try {
    const history = loadSessionHistory();
    
    // Add new session
    history.sessions.unshift(session);
    history.totalSessions += 1;
    history.totalQuestions += session.questionCount;

    // Track question IDs
    session.answers.forEach(answer => {
      history.questionHistory.add(answer.questionId);
    });

    // Trim question history to max size
    if (history.questionHistory.size > MAX_QUESTION_HISTORY) {
      const historyArray = Array.from(history.questionHistory);
      history.questionHistory = new Set(historyArray.slice(-MAX_QUESTION_HISTORY));
    }

    // Keep only last 100 sessions
    if (history.sessions.length > 100) {
      history.sessions = history.sessions.slice(0, 100);
    }

    // Save to localStorage
    const { questionHistory, ...restHistory } = history;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(restHistory));
    localStorage.setItem(QUESTION_HISTORY_KEY, JSON.stringify(Array.from(questionHistory)));
  } catch (error) {
    console.error('Failed to save session:', error);
  }
}

/**
 * Get recent question IDs to avoid repetition
 */
export function getRecentQuestionIds(limit: number = 20): Set<string> {
  try {
    const questionData = localStorage.getItem(QUESTION_HISTORY_KEY);
    if (!questionData) return new Set();

    const history = JSON.parse(questionData);
    return new Set(history.slice(-limit));
  } catch (error) {
    console.error('Failed to load question history:', error);
    return new Set();
  }
}

/**
 * Clear all session history
 */
export function clearSessionHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(QUESTION_HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear session history:', error);
  }
}

/**
 * Get sessions filtered by role
 */
export function getSessionsByRole(role: RoleSkill): CompletedSession[] {
  const history = loadSessionHistory();
  return history.sessions.filter(s => s.role === role);
}

/**
 * Calculate average performance metrics across all sessions
 */
export function calculateAverageMetrics(): {
  avgAttention: number;
  avgWpm: number;
  avgStarScore: number;
  totalSessions: number;
} {
  const history = loadSessionHistory();
  
  if (history.sessions.length === 0) {
    return {
      avgAttention: 0,
      avgWpm: 0,
      avgStarScore: 0,
      totalSessions: 0,
    };
  }

  let totalAttention = 0;
  let totalWpm = 0;
  let totalStarScore = 0;
  let count = 0;

  history.sessions.forEach(session => {
    session.answers.forEach(answer => {
      if (answer.attentionMetrics) {
        totalAttention += answer.attentionMetrics.attentionScore;
        count++;
      }
      if (answer.textMetrics) {
        totalWpm += answer.textMetrics.wpm;
      }
      if (answer.starScores) {
        const avgScore = (
          answer.starScores.S +
          answer.starScores.T +
          answer.starScores.A +
          answer.starScores.R
        ) / 4;
        totalStarScore += avgScore;
      }
    });
  });

  return {
    avgAttention: count > 0 ? totalAttention / count : 0,
    avgWpm: count > 0 ? totalWpm / count : 0,
    avgStarScore: count > 0 ? totalStarScore / count : 0,
    totalSessions: history.sessions.length,
  };
}
