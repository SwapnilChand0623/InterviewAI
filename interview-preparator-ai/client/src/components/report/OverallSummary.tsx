/**
 * Overall interview grade summary card
 */

import type { SessionResults } from '@/types/results';

interface OverallSummaryProps {
  overall: NonNullable<SessionResults['overall']>;
  className?: string;
}

export function OverallSummary({ overall, className = '' }: OverallSummaryProps) {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'B':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'C':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'D':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'F':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Overall Interview Grade</h2>

      {/* Score and Grade */}
      <div className="flex items-center gap-6 mb-6">
        <div className="flex-1">
          <div className={`text-6xl font-bold ${getScoreColor(overall.score)}`}>
            {overall.score}
          </div>
          <div className="text-sm text-gray-600 mt-1">Overall Score</div>
        </div>
        <div
          className={`px-8 py-4 rounded-xl border-2 ${getGradeColor(overall.grade)}`}
        >
          <div className="text-5xl font-bold">{overall.grade}</div>
        </div>
      </div>

      {/* Aggregates Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">
            {overall.aggregates.avgWpm}
          </div>
          <div className="text-xs text-gray-600">Avg WPM</div>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">
            {overall.aggregates.avgAttention}%
          </div>
          <div className="text-xs text-gray-600">Avg Attention</div>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">
            {overall.aggregates.avgRelevance}%
          </div>
          <div className="text-xs text-gray-600">Avg Relevance</div>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">
            {overall.aggregates.starMean}%
          </div>
          <div className="text-xs text-gray-600">STAR Mean</div>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">
            {overall.aggregates.fillerPerMin}
          </div>
          <div className="text-xs text-gray-600">Filler/min</div>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">
            {overall.aggregates.answeredCount}/{overall.aggregates.answeredCount + overall.aggregates.skippedCount}
          </div>
          <div className="text-xs text-gray-600">Answered</div>
        </div>
      </div>

      {/* Summary Feedback */}
      <div className="border-t pt-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Feedback Summary</h3>
        <ul className="space-y-2">
          {overall.summary.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
