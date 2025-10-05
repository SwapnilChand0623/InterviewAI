/**
 * Unit tests for relevance analysis
 * 
 * To run: npm test
 */

import { describe, it, expect } from 'vitest';
import { scoreRelevanceLocal } from '../relevance';

describe('Relevance Analysis', () => {
  describe('scoreRelevanceLocal', () => {
    it('should score on-topic React answer highly', () => {
      const input = {
        transcript: `
          In my previous project, we had a performance issue with React state management.
          The situation was that our application had excessive re-renders causing slow UI.
          My task was to optimize the component tree and reduce unnecessary renders.
          I implemented useMemo and useCallback hooks to memoize expensive computations
          and callback functions. I also used React.memo for pure components.
          As a result, we reduced render count by 60% and improved load time by 2 seconds.
        `,
        role: 'frontend_react',
        skill: 'React',
        question: 'Describe a time you optimized React performance',
      };

      const result = scoreRelevanceLocal(input);

      expect(result.score).toBeGreaterThanOrEqual(70);
      expect(result.verdict).toBe('on_topic');
      expect(result.matchedKeywords.length).toBeGreaterThan(3);
    });

    it('should score partially on-topic answer moderately', () => {
      const input = {
        transcript: `
          I worked on a web project where we needed to make some changes.
          It was a challenging task and I learned a lot.
          We used JavaScript and made things work better.
          The team was happy with the results.
        `,
        role: 'frontend_react',
        skill: 'React',
        question: 'Explain React hooks and when to use them',
      };

      const result = scoreRelevanceLocal(input);

      expect(result.score).toBeLessThan(70);
      expect(result.score).toBeGreaterThanOrEqual(20);
      expect(result.verdict).toBe('partially_on_topic');
    });

    it('should score off-topic answer lowly', () => {
      const input = {
        transcript: `
          I don't really know much about that. Um, like, I think maybe
          it's something about programming? I'm not sure. Actually,
          I was watching a football game yesterday and it was really exciting.
          You know, I like sports more than coding.
        `,
        role: 'frontend_react',
        skill: 'React',
        question: 'Explain React reconciliation algorithm',
      };

      const result = scoreRelevanceLocal(input);

      expect(result.score).toBeLessThan(40);
      expect(result.verdict).toBe('off_topic');
      expect(result.missingKeywords.length).toBeGreaterThan(5);
    });

    it('should detect backend Node.js keywords', () => {
      const input = {
        transcript: `
          I built an Express API with middleware for rate limiting and authentication.
          We used JWT tokens and Redis for caching. The database was MongoDB.
          I implemented async/await patterns for handling requests.
        `,
        role: 'backend_node',
        skill: 'Node.js',
        question: 'Describe building a REST API',
      };

      const result = scoreRelevanceLocal(input);

      expect(result.score).toBeGreaterThanOrEqual(60);
      expect(result.matchedKeywords).toContain('express');
      expect(result.matchedKeywords).toContain('api');
    });

    it('should detect SQL/data keywords', () => {
      const input = {
        transcript: `
          I optimized a slow query by adding an index on the join column.
          The query plan showed a full table scan which I fixed.
          I used aggregate functions with group by to get the metrics.
          The result was 10x faster query execution.
        `,
        role: 'data_sql',
        skill: 'SQL',
        question: 'How do you optimize database queries?',
      };

      const result = scoreRelevanceLocal(input);

      expect(result.score).toBeGreaterThanOrEqual(60);
      expect(result.matchedKeywords).toContain('index');
      expect(result.matchedKeywords).toContain('query');
    });

    it('should penalize answers with off-topic markers', () => {
      const inputWithMarkers = {
        transcript: "I don't know, I'm not sure about this topic.",
        role: 'frontend_react',
        skill: 'React',
        question: 'Explain React hooks',
      };

      const inputWithout = {
        transcript: 'React hooks are functions that let you use state in function components.',
        role: 'frontend_react',
        skill: 'React',
        question: 'Explain React hooks',
      };

      const resultWith = scoreRelevanceLocal(inputWithMarkers);
      const resultWithout = scoreRelevanceLocal(inputWithout);

      expect(resultWith.score).toBeLessThan(resultWithout.score);
    });

    it('should handle empty transcript gracefully', () => {
      const input = {
        transcript: '',
        role: 'frontend_react',
        skill: 'React',
        question: 'Explain something',
      };

      const result = scoreRelevanceLocal(input);

      expect(result.score).toBe(0);
      expect(result.verdict).toBe('off_topic');
    });

    it('should provide actionable reasons', () => {
      const input = {
        transcript: 'Short answer without details.',
        role: 'frontend_react',
        skill: 'React',
        question: 'Describe a complex React project',
      };

      const result = scoreRelevanceLocal(input);

      expect(result.reasons).toBeDefined();
      expect(result.reasons.length).toBeGreaterThan(0);
      expect(result.reasons[0]).toBeTruthy();
    });
  });
});
