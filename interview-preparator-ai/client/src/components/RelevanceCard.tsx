/**
 * Relevance scoring display card
 */

import type { RelevanceResult } from '@/features/analysis/relevance';

interface RelevanceCardProps {
  relevance: RelevanceResult;
  className?: string;
}

const verdictColors = {
  on_topic: 'bg-green-50 border-green-200 text-green-900',
  partially_on_topic: 'bg-yellow-50 border-yellow-200 text-yellow-900',
  off_topic: 'bg-red-50 border-red-200 text-red-900',
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
    <div className={`bg-white rounded-lg border-2 border-gray-200 p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Answer Relevance</h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${verdictColor}`}
        >
          {verdictLabel}
        </span>
      </div>

      {/* Score */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold text-gray-900">{relevance.score}</span>
          <span className="text-xl text-gray-500">/100</span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ease-out ${
              relevance.verdict === 'on_topic'
                ? 'bg-green-500'
                : relevance.verdict === 'partially_on_topic'
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${relevance.score}%` }}
          />
        </div>
      </div>

      {/* Reasons */}
      {relevance.reasons.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Analysis</h4>
          <ul className="space-y-1">
            {relevance.reasons.map((reason, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-gray-400 mt-0.5">•</span>
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
            <h4 className="text-sm font-semibold text-green-700 mb-2">
              ✓ Covered ({relevance.matchedKeywords.length})
            </h4>
            <div className="flex flex-wrap gap-1">
              {relevance.matchedKeywords.slice(0, 8).map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded"
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
            <h4 className="text-sm font-semibold text-red-700 mb-2">
              ✗ Missing ({relevance.missingKeywords.length})
            </h4>
            <div className="flex flex-wrap gap-1">
              {relevance.missingKeywords.slice(0, 8).map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded"
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
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            <span className="font-semibold">⚠️ Focus needed:</span> Your answer strayed from the
            question. Try to directly address{' '}
            {relevance.missingKeywords.slice(0, 3).join(', ')}.
          </p>
        </div>
      )}
    </div>
  );
}
