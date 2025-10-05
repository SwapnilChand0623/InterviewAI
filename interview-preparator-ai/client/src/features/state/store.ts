/**
 * Zustand store for application state
 */

import { create } from 'zustand';
import type { RoleSkill, Question } from '@/lib/questions';
import type { TextMetrics } from '@/features/analysis/text';
import type { StarScores } from '@/features/analysis/star';
import type { AttentionMetrics } from '@/features/analysis/attention';
import type { SessionAnswer } from '@/lib/sessionStorage';

export interface SessionInfo {
  role: RoleSkill | null;
  skill: string | null;
  questions: Question[]; // Array of questions for the session
  currentQuestionIndex: number;
  duration: number; // seconds per question
  startTime: number | null;
  endTime: number | null;
  isPaused: boolean;
  pausedTime: number | null;
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
  rawAttention: {
    headVariance: number;
    gazeDrift: number;
  };
  // Track all answers in the session
  sessionAnswers: SessionAnswer[];
  currentQuestionStartTime: number | null;
}

export interface AppState {
  session: SessionInfo;
  media: MediaState;
  metrics: SessionMetrics;

  // Actions
  setSession: (session: Partial<SessionInfo>) => void;
  startSession: (role: RoleSkill, questions: Question[], duration: number) => void;
  endSession: () => void;
  
  // Multi-question support
  nextQuestion: () => boolean;
  pauseSession: () => void;
  resumeSession: () => void;
  getCurrentQuestion: () => Question | null;
  saveCurrentAnswer: () => void;
  
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
  ) => void;

  reset: () => void;
}

const initialState = {
  session: {
    role: null,
    skill: null,
    questions: [],
    currentQuestionIndex: 0,
    duration: 120, // 2 minutes default per question
    startTime: null,
    endTime: null,
    isPaused: false,
    pausedTime: null,
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
    rawAttention: {
      headVariance: 0,
      gazeDrift: 0,
    },
    sessionAnswers: [],
    currentQuestionStartTime: null,
  },
};

export const useStore = create<AppState>((set, get) => ({
  ...initialState,

  setSession: (session) => {
    set((state) => ({
      session: { ...state.session, ...session },
    }));
  },

  startSession: (role, questions, duration) => {
    set({
      session: {
        role,
        skill: role,
        questions,
        currentQuestionIndex: 0,
        duration,
        startTime: Date.now(),
        endTime: null,
        isPaused: false,
        pausedTime: null,
      },
      media: {
        ...get().media,
        isRecording: true,
      },
      metrics: {
        ...initialState.metrics,
        currentQuestionStartTime: Date.now(),
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

  getCurrentQuestion: () => {
    const { session } = get();
    if (session.questions.length === 0) return null;
    return session.questions[session.currentQuestionIndex] || null;
  },

  saveCurrentAnswer: () => {
    const state = get();
    const currentQuestion = state.session.questions[state.session.currentQuestionIndex];
    
    if (!currentQuestion || !state.metrics.currentQuestionStartTime) return;

    const answer: SessionAnswer = {
      questionId: currentQuestion.id,
      question: currentQuestion.q,
      startTime: state.metrics.currentQuestionStartTime,
      endTime: Date.now(),
      transcript: state.metrics.transcript,
      textMetrics: state.metrics.textMetrics,
      starScores: state.metrics.starScores,
      attentionMetrics: state.metrics.attentionMetrics,
      rawAttention: state.metrics.rawAttention,
    };

    set((state) => ({
      metrics: {
        ...state.metrics,
        sessionAnswers: [...state.metrics.sessionAnswers, answer],
      },
    }));
  },

  nextQuestion: () => {
    const state = get();
    const nextIndex = state.session.currentQuestionIndex + 1;
    
    if (nextIndex >= state.session.questions.length) {
      return false; // No more questions
    }

    // Save current answer before moving to next
    get().saveCurrentAnswer();

    set((state) => ({
      session: {
        ...state.session,
        currentQuestionIndex: nextIndex,
      },
      metrics: {
        ...state.metrics,
        transcript: '',
        textMetrics: null,
        starScores: null,
        attentionMetrics: null,
        rawAttention: {
          headVariance: 0,
          gazeDrift: 0,
        },
        currentQuestionStartTime: Date.now(),
      },
    }));

    return true;
  },

  pauseSession: () => {
    set((state) => ({
      session: {
        ...state.session,
        isPaused: true,
        pausedTime: Date.now(),
      },
    }));
  },

  resumeSession: () => {
    set((state) => ({
      session: {
        ...state.session,
        isPaused: false,
        pausedTime: null,
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

    const textMetrics = analyzeText(transcript, duration);
    const starAnalysis = analyzeSTAR(transcript);
    const attentionMetrics = analyzeAttention(headVariance, gazeDrift);

    set((state) => ({
      metrics: {
        ...state.metrics,
        transcript,
        textMetrics,
        starScores: starAnalysis.scores,
        attentionMetrics,
        rawAttention: {
          headVariance,
          gazeDrift,
        },
      },
    }));
  },

  reset: () => {
    set(initialState);
  },
}));
