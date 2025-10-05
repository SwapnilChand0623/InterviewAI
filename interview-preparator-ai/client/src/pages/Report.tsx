/**
 * Report page - Display analysis results
 */

import { useNavigate } from 'react-router-dom';
import { useStore } from '@/features/state/store';
import { MetricCard } from '@/components/MetricCard';
import { StarBars } from '@/components/StarBars';
import { FeedbackPanel } from '@/components/FeedbackPanel';
import { RelevanceCard } from '@/components/RelevanceCard';
import { getTextSuggestions } from '@/features/analysis/text';
import { getOverallStarScore } from '@/features/analysis/star';
import { getAttentionSuggestions } from '@/features/analysis/attention';
import { downloadJSON, downloadCSV } from '@/lib/utils';
import { useEffect } from 'react';

export function Report() {
  const navigate = useNavigate();
  const { session, metrics, reset } = useStore();

  // Redirect if no metrics
  useEffect(() => {
    if (!metrics.textMetrics && !metrics.starScores) {
      navigate('/');
    }
  }, [metrics, navigate]);

  const handleNewSession = () => {
    reset();
    navigate('/');
  };

  const handleDownloadJSON = () => {
    const data = {
      session,
      metrics,
      timestamp: new Date().toISOString(),
    };
    downloadJSON(data, `interview-report-${Date.now()}.json`);
  };

  const handleDownloadCSV = () => {
    if (!metrics.textMetrics || !metrics.starScores || !metrics.attentionMetrics) {
      return;
    }

    const data = [
      {
        role: session.role,
        question: session.question?.q,
        duration: session.duration,
        wpm: metrics.textMetrics.wpm,
        fillerCount: metrics.textMetrics.fillerCount,
        attentionScore: metrics.attentionMetrics.attentionScore,
        relevanceScore: metrics.relevance?.score || 0,
        relevanceVerdict: metrics.relevance?.verdict || 'unknown',
        starS: metrics.starScores.S,
        starT: metrics.starScores.T,
        starA: metrics.starScores.A,
        starR: metrics.starScores.R,
        overallStarScore: getOverallStarScore(metrics.starScores),
      },
    ];

    downloadCSV(data, `interview-metrics-${Date.now()}.csv`);
  };

  // Collect all suggestions
  const allSuggestions = [
    ...(metrics.textMetrics ? getTextSuggestions(metrics.textMetrics) : []),
    ...(metrics.attentionMetrics ? getAttentionSuggestions(metrics.attentionMetrics) : []),
    ...(metrics.relevance?.reasons || []),
  ];

  if (!metrics.textMetrics || !metrics.starScores || !metrics.attentionMetrics) {
    return null;
  }

  const overallStarScore = getOverallStarScore(metrics.starScores);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Interview Report
          </h1>
          <p className="text-gray-600">
            Here's your detailed performance analysis
          </p>
        </div>

        {/* Question Recap */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-sm font-medium text-gray-500 mb-2">Question</h2>
          <p className="text-lg text-gray-900">{session.question?.q}</p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Speaking Pace"
            value={`${metrics.textMetrics.wpm}`}
            subtitle="words per minute"
            color={
              metrics.textMetrics.paceRating === 'good'
                ? 'green'
                : metrics.textMetrics.paceRating === 'slow'
                ? 'yellow'
                : 'red'
            }
          />

          <MetricCard
            title="Filler Words"
            value={metrics.textMetrics.fillerCount}
            subtitle={`${metrics.textMetrics.fillerRate.toFixed(1)} per minute`}
            color={
              metrics.textMetrics.fillerRate < 2
                ? 'green'
                : metrics.textMetrics.fillerRate < 5
                ? 'yellow'
                : 'red'
            }
          />

          <MetricCard
            title="Attention"
            value={`${Math.round(metrics.attentionMetrics.attentionScore)}%`}
            subtitle={metrics.attentionMetrics.movementRating}
            color={
              metrics.attentionMetrics.attentionScore >= 80
                ? 'green'
                : metrics.attentionMetrics.attentionScore >= 60
                ? 'yellow'
                : 'red'
            }
          />

          <MetricCard
            title="STAR Score"
            value={`${overallStarScore}%`}
            subtitle="overall completeness"
            color={
              overallStarScore >= 70
                ? 'green'
                : overallStarScore >= 40
                ? 'yellow'
                : 'red'
            }
          />
        </div>

        {/* Relevance Analysis */}
        {metrics.relevance && (
          <div className="mb-8">
            <RelevanceCard relevance={metrics.relevance} />
          </div>
        )}

        {/* Detailed Analysis */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* STAR Breakdown */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <StarBars scores={metrics.starScores} />
          </div>

          {/* Filler Words Breakdown */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Filler Words Detected
            </h3>
            {metrics.textMetrics.fillerWords.length > 0 ? (
              <div className="space-y-2">
                {metrics.textMetrics.fillerWords.slice(0, 5).map((item) => (
                  <div key={item.word} className="flex items-center justify-between">
                    <span className="text-gray-700">"{item.word}"</span>
                    <span className="font-semibold text-gray-900">{item.count}×</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">
                Great job! No filler words detected.
              </p>
            )}

            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-900">
                <span className="font-semibold">Tip:</span> Pause instead of using filler
                words. Brief silence is better than "um" or "uh".
              </p>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        {allSuggestions.length > 0 && (
          <FeedbackPanel suggestions={allSuggestions} className="mb-8" />
        )}

        {/* Transcript */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Full Transcript
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <p className="text-gray-700 whitespace-pre-wrap">
              {metrics.transcript || (
                <span className="italic text-gray-400">
                  No transcript available
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleNewSession}
            className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Start New Session
          </button>

          <button
            onClick={handleDownloadJSON}
            className="px-8 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Download JSON
          </button>

          <button
            onClick={handleDownloadCSV}
            className="px-8 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}
