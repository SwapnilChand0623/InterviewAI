/**
 * STAR rubric progress bars component
 */

import { cn } from '@/lib/utils';
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
  if (score >= 70) return 'bg-green-500 dark:bg-green-400';
  if (score >= 40) return 'bg-yellow-500 dark:bg-yellow-400';
  return 'bg-red-500 dark:bg-red-400';
}

export function StarBars({ scores, className = '' }: StarBarsProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">STAR Completeness</h3>
      
      {(Object.keys(starLabels) as Array<keyof StarScores>).map((key) => {
        const score = scores[key];
        const label = starLabels[key];
        const color = getScoreColor(score);

        return (
          <div key={key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                {label}
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                {score}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className={cn(color, 'h-full transition-all duration-500 ease-out')}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        );
      })}

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <span className="font-semibold">STAR Framework:</span> Structure your answers with
          Situation (context), Task (challenge), Action (your steps), and Result (outcomes).
        </p>
      </div>
    </div>
  );
}
