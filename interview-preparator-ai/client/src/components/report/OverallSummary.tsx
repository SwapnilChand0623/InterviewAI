/**
 * Overall interview grade summary card
 */

import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Typography';
import type { SessionResults } from '@/types/results';

interface OverallSummaryProps {
  overall: NonNullable<SessionResults['overall']>;
  className?: string;
}

export function OverallSummary({ overall, className = '' }: OverallSummaryProps) {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-100 border-green-300 dark:border-green-800';
      case 'B':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-100 border-blue-300 dark:border-blue-800';
      case 'C':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-100 border-yellow-300 dark:border-yellow-800';
      case 'D':
        return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-100 border-orange-300 dark:border-orange-800';
      case 'F':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-100 border-red-300 dark:border-red-800';
      default:
        return 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-100 border-gray-300 dark:border-slate-700';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 60) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <Card variant="elevated" className={className}>
      <Heading level={2} className="mb-6">Overall Interview Grade</Heading>

      {/* Score and Grade */}
      <div className="flex items-center gap-6 mb-6">
        <div className="flex-1">
          <div className={cn('text-6xl font-bold', getScoreColor(overall.score))}>
            {overall.score}
          </div>
          <div className="text-sm text-gray-600 dark:text-slate-400 mt-1">Overall Score</div>
        </div>
        <div
          className={cn('px-8 py-4 rounded-2xl border-2', getGradeColor(overall.grade))}
        >
          <div className="text-5xl font-bold">{overall.grade}</div>
        </div>
      </div>

      {/* Aggregates Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            {overall.aggregates.avgWpm}
          </div>
          <div className="text-xs text-gray-600 dark:text-slate-400">Avg WPM</div>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            {overall.aggregates.avgAttention}%
          </div>
          <div className="text-xs text-gray-600 dark:text-slate-400">Avg Attention</div>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            {overall.aggregates.avgRelevance}%
          </div>
          <div className="text-xs text-gray-600 dark:text-slate-400">Avg Relevance</div>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            {overall.aggregates.starMean}%
          </div>
          <div className="text-xs text-gray-600 dark:text-slate-400">STAR Mean</div>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            {overall.aggregates.fillerPerMin}
          </div>
          <div className="text-xs text-gray-600 dark:text-slate-400">Filler/min</div>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            {overall.aggregates.answeredCount}/{overall.aggregates.answeredCount + overall.aggregates.skippedCount}
          </div>
          <div className="text-xs text-gray-600 dark:text-slate-400">Answered</div>
        </div>
      </div>

      {/* Summary Feedback */}
      <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-3">Feedback Summary</h3>
        <ul className="space-y-2">
          {overall.summary.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-slate-300">
              <span className="text-primary-600 dark:text-primary-400 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
