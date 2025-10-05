/**
 * Zustand store for application state
 */

import { create } from 'zustand';
import type { RoleSkill, Question } from '@/lib/questions';
import type { TextMetrics } from '@/features/analysis/text';
import type { StarScores } from '@/features/analysis/star';
import type { AttentionMetrics } from '@/features/analysis/attention';
import type { RelevanceResult } from '@/features/analysis/relevance';
import { getRandomQuestion } from '@/lib/questions';

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

  // Actions
  setSession: (session: Partial<SessionInfo>) => void;
  startSession: (role: RoleSkill, question: Question, duration: number) => void;
  endSession: () => void;
  
  setMediaState: (media: Partial<MediaState>) => void;
  addError: (error: string) => void;
  clearErrors: () => void;

  setTranscript: (transcript: string) => void;
  setMetrics: (metrics: Partial<SessionMetrics>) => void;
  computeMetrics: (
    transcript: string,
    duration: number,
    headVariance: number,
    gazeDrift: number
  ) => Promise<void>;

  // New actions
  finalizeAnswerAndScore: (
    transcript: string,
    duration: number,
    headVariance: number,
    gazeDrift: number
  ) => Promise<void>;
  goToNextQuestion: () => void;
  skipQuestion: () => void;
  updateSettings: (settings: Partial<SessionSettings>) => void;

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
  },
  history: [],
  currentQuestionIndex: 0,
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

  setMediaState: (media) => {
    set((state) => ({
      media: { ...state.media, ...media },
    }));
  },

  addError: (error) => {
    set((state) => ({
      media: {
        ...state.media,
        errors: [...state.media.errors, error],
      },
    }));
  },

  clearErrors: () => {
    set((state) => ({
      media: {
        ...state.media,
        errors: [],
      },
    }));
  },

  setTranscript: (transcript) => {
    set((state) => ({
      metrics: {
        ...state.metrics,
        transcript,
      },
    }));
  },

  setMetrics: (metrics) => {
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
    await get().computeMetrics(transcript, duration, headVariance, gazeDrift);
    
    // Add to history
    const { session, metrics } = get();
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
  },

  goToNextQuestion: () => {
    const { session, currentQuestionIndex, history } = get();
    if (!session.role) return;

    // Check if we've completed enough questions (e.g., 5 questions)
    const MAX_QUESTIONS = 5;
    if (history.length >= MAX_QUESTIONS) {
      // Mark session as finished
      set((state) => ({
        session: {
          ...state.session,
          status: 'finished',
          endTime: Date.now(),
        },
      }));
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
    const { session } = get();
    
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

    // Add to history if there's a question
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

    // Go to next question (or finish)
    get().goToNextQuestion();
  },

  updateSettings: (settings) => {
    set((state) => ({
      settings: { ...state.settings, ...settings },
    }));
  },

  reset: () => {
    set({
      ...initialState,
      session: { ...initialState.session },
      history: [], // Clear history
    });
  },
}));
