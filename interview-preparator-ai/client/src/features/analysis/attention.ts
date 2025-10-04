/**
 * Attention and movement analysis from face landmarks
 */

import { clamp, mapRange } from '@/lib/utils';

export interface AttentionMetrics {
  headVariance: number;
  gazeDrift: number;
  attentionScore: number; // 0-100
  movementRating: 'stable' | 'moderate' | 'excessive';
}

/**
 * Calculate attention score from head variance and gaze drift
 * Lower variance = better attention
 * Lower drift = better attention
 */
export function calculateAttentionScore(headVariance: number, gazeDrift: number): number {
  // Expected ranges based on typical face tracking values
  const HEAD_VARIANCE_MIN = 0;
  const HEAD_VARIANCE_MAX = 100; // Degrees squared variance threshold
  const GAZE_DRIFT_MIN = 0;
  const GAZE_DRIFT_MAX = 50; // Pixel drift threshold

  // Map to 0-100 (inverted: lower variance/drift = higher score)
  const headScore = mapRange(
    clamp(headVariance, HEAD_VARIANCE_MIN, HEAD_VARIANCE_MAX),
    HEAD_VARIANCE_MIN,
    HEAD_VARIANCE_MAX,
    100,
    0
  );

  const gazeScore = mapRange(
    clamp(gazeDrift, GAZE_DRIFT_MIN, GAZE_DRIFT_MAX),
    GAZE_DRIFT_MIN,
    GAZE_DRIFT_MAX,
    100,
    0
  );

  // Weighted average (head stability is more important)
  const attentionScore = Math.round(headScore * 0.7 + gazeScore * 0.3);

  return clamp(attentionScore, 0, 100);
}

/**
 * Rate movement based on head variance
 */
export function rateMovement(headVariance: number): 'stable' | 'moderate' | 'excessive' {
  if (headVariance < 20) return 'stable';
  if (headVariance < 50) return 'moderate';
  return 'excessive';
}

/**
 * Analyze attention metrics
 */
export function analyzeAttention(headVariance: number, gazeDrift: number): AttentionMetrics {
  const attentionScore = calculateAttentionScore(headVariance, gazeDrift);
  const movementRating = rateMovement(headVariance);

  return {
    headVariance,
    gazeDrift,
    attentionScore,
    movementRating,
  };
}

/**
 * Get suggestions based on attention metrics
 */
export function getAttentionSuggestions(metrics: AttentionMetrics): string[] {
  const suggestions: string[] = [];

  if (metrics.attentionScore >= 80) {
    suggestions.push('Excellent attention and stability! You maintained great eye contact.');
  } else if (metrics.attentionScore >= 60) {
    suggestions.push('Good attention overall. Try to minimize head movement for even better stability.');
  } else {
    suggestions.push(
      'Work on maintaining a stable head position and consistent eye contact with the camera.'
    );
  }

  if (metrics.movementRating === 'excessive') {
    suggestions.push(
      'You moved your head quite a bit. Practice keeping a more stable, centered position.'
    );
  }

  if (metrics.gazeDrift > 30) {
    suggestions.push(
      'Your gaze wandered. Focus on looking directly at the camera to simulate eye contact.'
    );
  }

  return suggestions;
}
