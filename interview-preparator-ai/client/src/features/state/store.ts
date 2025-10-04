/**
 * Zustand store for application state
 */

import { create } from 'zustand';
import type { RoleSkill, Question } from '@/lib/questions';
import type { TextMetrics } from '@/features/analysis/text';
import type { StarScores } from '@/features/analysis/star';
import type { AttentionMetrics } from '@/features/analysis/attention';

export interface SessionInfo {
  role: RoleSkill | null;
  skill: string | null;
  question: Question | null;
  duration: number; // seconds
  startTime: number | null;
  endTime: number | null;
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
}

export interface AppState {
  session: SessionInfo;
  media: MediaState;
  metrics: SessionMetrics;

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
  ) => void;

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
