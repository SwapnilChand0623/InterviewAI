/**
 * Relevance scoring display card
 */

import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import type { RelevanceResult } from '@/features/analysis/relevance';

interface RelevanceCardProps {
  relevance: RelevanceResult;
  className?: string;
}

const verdictColors = {
  on_topic: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100',
  partially_on_topic: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100',
  off_topic: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100',
};

const verdictLabels = {
  on_topic: 'On Topic',
  partially_on_topic: 'Partially On Topic',
  off_topic: 'Off Topic',
};

export function RelevanceCard({ relevance, className = '' }: RelevanceCardProps) {
  const verdictColor = verdictColors[relevance.verdict];
  const verdictLabel = verdictLabels[relevance.verdict];

  return (
    <Card variant="bordered" className={className}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Answer Relevance</h3>
        <span
          className={cn('px-3 py-1 rounded-full text-sm font-semibold border', verdictColor)}
        >
          {verdictLabel}
        </span>
      </div>

      {/* Score */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold text-gray-900 dark:text-slate-100">{relevance.score}</span>
          <span className="text-xl text-gray-500 dark:text-slate-400">/100</span>
        </div>
        <div className="mt-2 w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
          <div
            className={cn('h-full transition-all duration-500 ease-out',
              relevance.verdict === 'on_topic'
                ? 'bg-green-500 dark:bg-green-400'
                : relevance.verdict === 'partially_on_topic'
                ? 'bg-yellow-500 dark:bg-yellow-400'
                : 'bg-red-500 dark:bg-red-400'
            )}
            style={{ width: `${relevance.score}%` }}
          />
        </div>
      </div>

      {/* Reasons */}
      {relevance.reasons.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Analysis</h4>
          <ul className="space-y-1">
            {relevance.reasons.map((reason, index) => (
              <li key={index} className="text-sm text-gray-600 dark:text-slate-400 flex items-start gap-2">
                <span className="text-gray-400 dark:text-slate-500 mt-0.5">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Keywords */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Matched Keywords */}
        {relevance.matchedKeywords.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-green-700 dark:text-green-300 mb-2">
              ✓ Covered ({relevance.matchedKeywords.length})
            </h4>
            <div className="flex flex-wrap gap-1">
              {relevance.matchedKeywords.slice(0, 8).map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Missing Keywords */}
        {relevance.missingKeywords.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-red-700 dark:text-red-300 mb-2">
              ✗ Missing ({relevance.missingKeywords.length})
            </h4>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">Missing terms for this question</p>
            <div className="flex flex-wrap gap-1">
              {relevance.missingKeywords.slice(0, 8).map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Off-topic warning */}
      {relevance.verdict === 'off_topic' && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">
            <span className="font-semibold">⚠️ Focus needed:</span> Your answer strayed from the
            question. Try to directly address{' '}
            {relevance.missingKeywords.slice(0, 3).join(', ')}.
          </p>
        </div>
      )}
    </Card>
  );
}
