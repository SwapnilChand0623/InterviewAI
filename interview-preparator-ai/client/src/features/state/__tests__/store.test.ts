/**
 * Unit tests for Zustand store - transcript handling
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../store';
import type { Question } from '@/lib/questions';

describe('Store - Transcript Handling', () => {
  beforeEach(() => {
    // Reset store before each test
    useStore.getState().reset();
  });

  it('should store distinct transcripts for multiple questions', async () => {
    const store = useStore.getState();
    
    // Create mock questions
    const question1: Question = { id: 'test1', q: 'Explain React hooks' };
    const question2: Question = { id: 'test2', q: 'Describe component lifecycle' };
    
    // Start session with first question
    store.startSession('frontend_react' as any, question1, 60);
    
    // Answer first question with specific transcript
    const transcript1 = 'This is my answer to the first question about React hooks and state management';
    await store.finalizeAnswerAndScore(transcript1, 30, 2.5, 15);
    
    // Manually set next question and move to it
    store.setSession({ question: question2 });
    store.goToNextQuestion();
    
    // Answer second question with different transcript
    const transcript2 = 'This is a completely different answer about component lifecycle and effects';
    await store.finalizeAnswerAndScore(transcript2, 45, 3.0, 20);
    
    // Verify both questions have distinct transcripts
    const { results } = useStore.getState();
    expect(results).toBeDefined();
    expect(results!.questions.length).toBe(2);
    
    expect(results!.questions[0].transcript).toBe(transcript1);
    expect(results!.questions[1].transcript).toBe(transcript2);
    
    // Verify they are not the same reference
    expect(results!.questions[0].transcript).not.toBe(results!.questions[1].transcript);
  });

  it('should create deep clones of metrics for each question', async () => {
    const store = useStore.getState();
    
    // Create mock questions
    const question1: Question = { id: 'test3', q: 'Explain REST APIs' };
    const question2: Question = { id: 'test4', q: 'Describe database optimization' };
    
    // Start session
    store.startSession('backend_node' as any, question1, 60);
    
    // Answer first question
    await store.finalizeAnswerAndScore('First answer about APIs', 30, 2.5, 15);
    
    // Manually set next question and move to it
    store.setSession({ question: question2 });
    store.goToNextQuestion();
    
    // Answer second question
    await store.finalizeAnswerAndScore('Second answer about databases', 45, 3.0, 20);
    
    const { results } = useStore.getState();
    
    // Verify each question has its own metrics object
    expect(results!.questions[0].metrics).not.toBe(results!.questions[1].metrics);
    
    // Verify starScores are separate objects
    expect(results!.questions[0].metrics.starScores).not.toBe(results!.questions[1].metrics.starScores);
  });

  it('should handle skipped questions correctly', async () => {
    const store = useStore.getState();
    
    // Create mock question
    const question: Question = { id: 'test5', q: 'Explain SQL joins' };
    
    // Start session
    store.startSession('data_sql' as any, question, 60);
    
    // Skip first question
    store.skipQuestion();
    
    const { results } = useStore.getState();
    
    expect(results!.questions.length).toBe(1);
    expect(results!.questions[0].metrics.status).toBe('skipped');
    expect(results!.questions[0].transcript).toBe('');
  });
});
