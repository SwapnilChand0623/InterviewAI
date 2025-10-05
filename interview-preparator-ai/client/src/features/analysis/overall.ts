/**
 * Overall session grading and aggregation
 */

import type { SessionResults, QuestionResult } from '@/types/results';

/**
 * Compute overall score and grade for a single question
 * Uses same weighting as session overall: 35% relevance, 35% STAR, 15% attention, 10% pace, 5% filler
 * 
 * @param question - Single question result
 * @returns Object with score and grade
 */
export function computeQuestionGrade(question: QuestionResult): { score: number; grade: 'A' | 'B' | 'C' | 'D' | 'F' } {
  if (question.metrics.status === 'skipped') {
    return { score: 0, grade: 'F' };
  }

  const { wpm, fillerCount, attentionScore, starScores, relevance } = question.metrics;
  const durationMin = question.durationMs / 60000;

  // STAR average
  const starMean = (starScores.S + starScores.T + starScores.A + starScores.R) / 4;
  
  // Relevance score
  const relevanceScore = relevance?.score ?? 0;

  // Pace score: 110–150 WPM ideal → 100
  const paceScore = (() => {
    if (wpm >= 110 && wpm <= 150) return 100;
    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
    const left = wpm < 110 ? clamp((wpm - 70) / (110 - 70), 0, 1) : 1;
    const right = wpm > 150 ? clamp((200 - wpm) / (200 - 150), 0, 1) : 1;
    return Math.round(100 * Math.min(left, right));
  })();

  // Filler score: 0/min → 100; 10+/min → 0
  const fillerPerMin = fillerCount / Math.max(1, durationMin);
  const fillerScore = Math.max(0, Math.min(100, Math.round(100 * (1 - fillerPerMin / 10))));

  // Weighted composite (same weights as session overall)
  const w = {
    relevance: 0.35,
    star: 0.35,
    attention: 0.15,
    pace: 0.1,
    filler: 0.05,
  };

  const composite = Math.round(
    w.relevance * relevanceScore +
    w.star * starMean +
    w.attention * attentionScore +
    w.pace * paceScore +
    w.filler * fillerScore
  );

  // Assign letter grade
  const grade =
    composite >= 90 ? 'A' :
    composite >= 80 ? 'B' :
    composite >= 70 ? 'C' :
    composite >= 60 ? 'D' : 'F';

  return { score: composite, grade };
}

/**
 * Compute overall interview grade and aggregates from all question results
 * 
 * @param results - Session results with all questions
 * @returns Overall object with score, grade, summary, and aggregates
 */
export function computeOverall(results: SessionResults): NonNullable<SessionResults['overall']> {
  // Filter out skipped questions for scoring
  const answered = results.questions.filter(q => q.metrics.status !== 'skipped');
  const n = answered.length || 1;

  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / n;

  // Calculate individual question grades first (if not already computed)
  // IMPORTANT: Mutate the original questions array so grades persist
  results.questions.forEach(q => {
    if (q.metrics.status === 'skipped') {
      q.overallScore = 0;
      q.grade = 'F';
    } else if (q.overallScore === undefined || q.grade === undefined) {
      const { score, grade } = computeQuestionGrade(q);
      q.overallScore = score;
      q.grade = grade;
    }
  });

  // Overall score = average of individual question scores (only answered questions)
  const composite = Math.round(avg(answered.map(q => q.overallScore!)));

  // Calculate metric averages for display/aggregates
  const avgWpm = avg(answered.map(x => x.metrics.wpm));
  const fillerPerMin = avg(
    answered.map(x => x.metrics.fillerCount / Math.max(1, x.durationMs / 60000))
  );
  const avgAttention = avg(answered.map(x => x.metrics.attentionScore));
  const avgRelevance = avg(answered.map(x => x.metrics.relevance?.score ?? 0));
  const starMean = avg(
    answered.map(x => {
      const { S, T, A, R } = x.metrics.starScores;
      return (S + T + A + R) / 4;
    })
  );

  // Assign overall letter grade
  const grade =
    composite >= 90 ? 'A' :
    composite >= 80 ? 'B' :
    composite >= 70 ? 'C' :
    composite >= 60 ? 'D' : 'F';

  // Generate summary feedback
  const summary: string[] = [
    composite >= 80
      ? 'Strong overall performance.'
      : 'Needs improvement overall.',
    avgRelevance < 70
      ? 'Work on staying on-topic to the prompt.'
      : 'On-topic content was solid.',
    starMean < 65
      ? 'Improve STAR completeness (especially T/R).'
      : 'STAR structure was generally complete.',
    avgAttention < 65
      ? 'Increase head/eye stability.'
      : 'Attention was acceptable.',
    fillerPerMin > 5 ? 'Reduce filler words.' : 'Filler words were under control.',
  ];

  return {
    score: composite,
    grade,
    summary,
    aggregates: {
      avgWpm: Math.round(avgWpm),
      avgAttention: Math.round(avgAttention),
      avgRelevance: Math.round(avgRelevance),
      starMean: Math.round(starMean),
      fillerPerMin: Number(fillerPerMin.toFixed(1)),
      answeredCount: answered.length,
      skippedCount: results.questions.length - answered.length,
    },
  };
}
