/**
 * Zustand store for application state
 */

import { create } from 'zustand';
import type { Question, RoleSkill } from '@/lib/questions';
import type { TextMetrics } from '@/features/analysis/text';
import type { StarScores } from '@/features/analysis/star';
import type { AttentionMetrics } from '@/features/analysis/attention';
import type { RelevanceResult } from '@/features/analysis/relevance';
import type { SessionResults, QuestionResult } from '@/types/results';
import { getRandomQuestion } from '@/lib/questions';
import { computeOverall } from '@/features/analysis/overall';

export interface SessionInfo {
  role: RoleSkill | null;
  skill: string | null;
  question: Question | null;
  duration: number; // seconds
  startTime: number | null;
  endTime: number | null;
  status: 'active' | 'finished';
}

export interface MediaState {
  isRecording: boolean;
  hasPermission: boolean;
  errors: string[];
}

export interface SessionMetrics {
  transcript: string;
  textMetrics: TextMetrics | null;
  starScores: StarScores | null;
  attentionMetrics: AttentionMetrics | null;
  relevance: RelevanceResult | null;
  rawAttention: {
    headVariance: number;
    gazeDrift: number;
  };
  status: 'completed' | 'skipped' | 'in_progress';
}

export interface SessionSettings {
  autoAdvance: boolean;
  silenceMs: number;
  minSpeakMs: number;
  autoAdvanceDelayMs: number;
  showLandmarks: boolean;
}

export interface QuestionHistory {
  question: Question;
  metrics: SessionMetrics;
  timestamp: number;
}

export interface AppState {
  session: SessionInfo;
  media: MediaState;
  metrics: SessionMetrics;
  settings: SessionSettings;
  history: QuestionHistory[];
  currentQuestionIndex: number;
  results: SessionResults | null;
  ui: {
    reportCurrentIndex: number;
  };

  // Actions
  setSession: (session: Partial<SessionInfo>) => void;
  startSession: (role: RoleSkill, question: Question, duration: number) => void;
  endSession: () => void;
  setMedia: (media: Partial<MediaState>) => void;
  setMetrics: (metrics: Partial<SessionMetrics>) => void;
  computeMetrics: (
    transcript: string,
    duration: number,
    headVariance: number,
    gazeDrift: number
  ) => Promise<void>;
  finalizeAnswerAndScore: (
    transcript: string,
    duration: number,
    headVariance: number,
    gazeDrift: number
  ) => Promise<void>;
  goToNextQuestion: () => void;
  skipQuestion: () => void;
  updateSettings: (settings: Partial<SessionSettings>) => void;
  setReportIndex: (index: number) => void;
  reset: () => void;
}

const initialState = {
  session: {
    role: null,
    skill: null,
    question: null,
    duration: 120, // 2 minutes default
    startTime: null,
    endTime: null,
    status: 'active' as const,
  },
  media: {
    isRecording: false,
    hasPermission: false,
    errors: [],
  },
  metrics: {
    transcript: '',
    textMetrics: null,
    starScores: null,
    attentionMetrics: null,
    relevance: null,
    rawAttention: {
      headVariance: 0,
      gazeDrift: 0,
    },
    status: 'in_progress' as const,
  },
  settings: {
    autoAdvance: true,
    silenceMs: 3200,
    minSpeakMs: 8000,
    autoAdvanceDelayMs: 2500,
    showLandmarks: false,
  },
  history: [],
  currentQuestionIndex: 0,
  results: null,
  ui: {
    reportCurrentIndex: 0,
  },
};

export const useStore = create<AppState>((set, get) => ({
  ...initialState,

  setSession: (session) => {
    set((state) => ({
      session: { ...state.session, ...session },
    }));
  },

  startSession: (role, question, duration) => {
    set({
      session: {
        role,
        skill: role,
        question,
        duration,
        startTime: Date.now(),
        endTime: null,
        status: 'active',
      },
      media: {
        ...get().media,
        isRecording: true,
      },
      metrics: initialState.metrics,
      results: {
        startedAt: new Date().toISOString(),
        endedAt: '',
        role,
        skill: role,
        questions: [],
      },
      ui: {
        reportCurrentIndex: 0,
      },
    });
  },

  endSession: () => {
    set((state) => ({
      session: {
        ...state.session,
        endTime: Date.now(),
      },
      media: {
        ...state.media,
        isRecording: false,
      },
    }));
  },

  setMedia: (media: Partial<MediaState>) => {
    set((state) => ({
      media: { ...state.media, ...media },
    }));
  },

  setTranscript: (transcript: string) => {
    set((state) => ({
      metrics: {
        ...state.metrics,
        transcript,
      },
    }));
  },

  setMetrics: (metrics: Partial<SessionMetrics>) => {
    set((state) => ({
      metrics: { ...state.metrics, ...metrics },
    }));
  },

  computeMetrics: async (transcript, duration, headVariance, gazeDrift) => {
    // Dynamic imports to avoid circular dependencies
    const { analyzeText } = await import('@/features/analysis/text');
    const { analyzeSTAR } = await import('@/features/analysis/star');
    const { analyzeAttention } = await import('@/features/analysis/attention');
    const { scoreRelevance } = await import('@/features/analysis/relevance');

    const textMetrics = analyzeText(transcript, duration);
    const starAnalysis = analyzeSTAR(transcript);
    const attentionMetrics = analyzeAttention(headVariance, gazeDrift);
    
    // Compute relevance if we have role/skill/question
    const { session } = get();
    let relevance: RelevanceResult | null = null;
    if (session.role && session.skill && session.question) {
      relevance = await scoreRelevance({
        transcript,
        role: session.role,
        skill: session.skill,
        question: session.question.q,
      });
    }

    set((state) => ({
      metrics: {
        ...state.metrics,
        transcript,
        textMetrics,
        starScores: starAnalysis.scores,
        attentionMetrics,
        relevance,
        rawAttention: {
          headVariance,
          gazeDrift,
        },
        status: 'completed',
      },
    }));
  },

  finalizeAnswerAndScore: async (transcript, duration, headVariance, gazeDrift) => {
    const { session, results } = get();
    
    // First compute all metrics
    await get().computeMetrics(transcript, duration, headVariance, gazeDrift);

    const { metrics } = get();

    // Add to history (legacy)
    if (session.question) {
      set((state) => ({
        history: [
          ...state.history,
          {
            question: session.question!,
            metrics: { ...metrics },
            timestamp: Date.now(),
          },
        ],
      }));
    }

    // Add to results as QuestionResult
    if (session.question && results) {
      const questionResult: QuestionResult = {
        id: session.question.id,
        question: session.question.q,
        transcript,
        durationMs: duration * 1000,
        metrics: {
          wpm: metrics.textMetrics?.wpm || 0,
          fillerCount: metrics.textMetrics?.fillerCount || 0,
          attentionScore: metrics.attentionMetrics?.attentionScore || 0,
          starScores: metrics.starScores || { S: 0, T: 0, A: 0, R: 0 },
          relevance: metrics.relevance || undefined,
          status: metrics.status === 'skipped' ? 'skipped' : 'answered',
        },
      };

      set((state) => ({
        results: state.results
          ? {
              ...state.results,
              questions: [...state.results.questions, questionResult],
            }
          : null,
      }));
    }
  },

  goToNextQuestion: () => {
    const { session, currentQuestionIndex, history, results } = get();
    if (!session.role) return;

    // Check if we've completed enough questions (e.g., 5 questions)
    const MAX_QUESTIONS = 5;
    if (history.length >= MAX_QUESTIONS) {
      // Compute overall grade
      if (results && results.questions.length > 0) {
        const overall = computeOverall(results);
        set((state) => ({
          session: {
            ...state.session,
            status: 'finished',
            endTime: Date.now(),
          },
          results: state.results
            ? {
                ...state.results,
                endedAt: new Date().toISOString(),
                overall,
              }
            : null,
        }));
      } else {
        // Mark session as finished without overall
        set((state) => ({
          session: {
            ...state.session,
            status: 'finished',
            endTime: Date.now(),
          },
        }));
      }
      return;
    }

    // Get next question
    const nextQuestion = getRandomQuestion(session.role);
    
    set((state) => ({
      session: {
        ...state.session,
        question: nextQuestion,
        startTime: null,
        endTime: null,
        status: 'active',
      },
      metrics: {
        ...initialState.metrics,
        status: 'in_progress',
      },
      currentQuestionIndex: currentQuestionIndex + 1,
    }));
  },

  skipQuestion: () => {
    const { session, results } = get();
    
    // Mark current as skipped (minimal data)
    const skippedMetrics: SessionMetrics = {
      transcript: '',
      textMetrics: null,
      starScores: null,
      attentionMetrics: null,
      relevance: null,
      rawAttention: { headVariance: 0, gazeDrift: 0 },
      status: 'skipped',
    };

    set({
      metrics: skippedMetrics,
    });

    // Add to history if there's a question (legacy)
    if (session.question) {
      set((state) => ({
        history: [
          ...state.history,
          {
            question: session.question!,
            metrics: skippedMetrics,
            timestamp: Date.now(),
          },
        ],
      }));
    }

    // Add to results as skipped QuestionResult
    if (session.question && results) {
      const skippedResult: QuestionResult = {
        id: session.question.id,
        question: session.question.q,
        transcript: '',
        durationMs: 0,
        metrics: {
          wpm: 0,
          fillerCount: 0,
          attentionScore: 0,
          starScores: { S: 0, T: 0, A: 0, R: 0 },
          status: 'skipped',
        },
      };

      set((state) => ({
        results: state.results
          ? {
              ...state.results,
              questions: [...state.results.questions, skippedResult],
            }
          : null,
      }));
    }

    // Go to next question (or finish)
    get().goToNextQuestion();
  },

  updateSettings: (settings) => {
    set((state) => ({
      settings: { ...state.settings, ...settings },
    }));
  },

  setReportIndex: (index) => {
    set((state) => ({
      ui: { ...state.ui, reportCurrentIndex: index },
    }));
  },

  reset: () => {
    set({
      ...initialState,
      session: { ...initialState.session },
      history: [], // Clear history
      results: null,
      ui: { reportCurrentIndex: 0 },
    });
  },
}));
