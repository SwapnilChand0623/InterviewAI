/**
 * STAR rubric progress bars component
 */

import type { StarScores } from '@/features/analysis/star';

interface StarBarsProps {
  scores: StarScores;
  className?: string;
}

const starLabels = {
  S: 'Situation',
  T: 'Task',
  A: 'Action',
  R: 'Result',
};

function getScoreColor(score: number): string {
  if (score >= 70) return 'bg-green-500';
  if (score >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
}

export function StarBars({ scores, className = '' }: StarBarsProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900">STAR Completeness</h3>
      
      {(Object.keys(starLabels) as Array<keyof StarScores>).map((key) => {
        const score = scores[key];
        const label = starLabels[key];
        const color = getScoreColor(score);

        return (
          <div key={key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                {label}
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {score}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full ${color} transition-all duration-500 ease-out`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        );
      })}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">STAR Framework:</span> Structure your answers with
          Situation (context), Task (challenge), Action (your steps), and Result (outcomes).
        </p>
      </div>
    </div>
  );
}
