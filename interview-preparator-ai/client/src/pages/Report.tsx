/**
 * Report page - Display multi-question analysis results
 */

import { useNavigate } from 'react-router-dom';
import { useStore } from '@/features/state/store';
import { MetricCard } from '@/components/MetricCard';
import { StarBars } from '@/components/StarBars';
import { FeedbackPanel } from '@/components/FeedbackPanel';
import { RelevanceCard } from '@/components/RelevanceCard';
import { QuestionPager } from '@/components/report/QuestionPager';
import { OverallSummary } from '@/components/report/OverallSummary';
import { getTextSuggestions, ratePace, countWords } from '@/features/analysis/text';
import { getOverallStarScore } from '@/features/analysis/star';
import { getAttentionSuggestions } from '@/features/analysis/attention';
import { downloadJSON, downloadCSV } from '@/lib/utils';
import { useEffect } from 'react';

export function Report() {
  const navigate = useNavigate();
  const { results, ui, setReportIndex, reset } = useStore();

  // Redirect if no results
  useEffect(() => {
    if (!results || results.questions.length === 0) {
      navigate('/');
    }
  }, [results, navigate]);

  const handleNewSession = () => {
    reset();
    navigate('/');
  };

  const handleDownloadJSON = () => {
    if (!results) return;
    downloadJSON(results, `interview-session-${Date.now()}.json`);
  };

  const handleDownloadCSV = () => {
    if (!results || results.questions.length === 0) return;

    const data = results.questions.map((q, idx) => ({
      questionNumber: idx + 1,
      question: q.question,
      status: q.metrics.status,
      grade: q.grade || 'N/A',
      overallScore: q.overallScore || 0,
      durationSeconds: Math.round(q.durationMs / 1000),
      wpm: q.metrics.wpm,
      fillerCount: q.metrics.fillerCount,
      attentionScore: q.metrics.attentionScore,
      relevanceScore: q.metrics.relevance?.score || 0,
      relevanceVerdict: q.metrics.relevance?.verdict || 'n/a',
      starS: q.metrics.starScores.S,
      starT: q.metrics.starScores.T,
      starA: q.metrics.starScores.A,
      starR: q.metrics.starScores.R,
      overallStarScore: getOverallStarScore(q.metrics.starScores),
    }));

    downloadCSV(data, `interview-session-${Date.now()}.csv`);
  };

  if (!results || results.questions.length === 0) {
    return null;
  }

  // Get current question
  const currentQuestion = results.questions[ui.reportCurrentIndex];
  const currentMetrics = currentQuestion.metrics;

  // Compute derived values for suggestions
  const durationSeconds = currentQuestion.durationMs / 1000;
  const wordCount = countWords(currentQuestion.transcript);
  const fillerRate = durationSeconds > 0 ? (currentMetrics.fillerCount / durationSeconds) * 60 : 0;
  const paceRating = ratePace(currentMetrics.wpm);
  
  // Approximate movement rating from attention score
  const movementRating: 'stable' | 'moderate' | 'excessive' = 
    currentMetrics.attentionScore >= 80 ? 'stable' :
    currentMetrics.attentionScore >= 60 ? 'moderate' : 'excessive';

  // Collect suggestions for current question
  const allSuggestions = [
    ...(currentMetrics.wpm ? getTextSuggestions({
      wpm: currentMetrics.wpm,
      fillerCount: currentMetrics.fillerCount,
      fillerRate,
      fillerWords: [],
      paceRating,
      wordCount,
    }) : []),
    ...(currentMetrics.attentionScore ? getAttentionSuggestions({
      attentionScore: currentMetrics.attentionScore,
      movementRating,
      headVariance: 0,
      gazeDrift: 0,
    }) : []),
    ...(currentMetrics.relevance?.reasons || []),
  ];

  const overallStarScore = getOverallStarScore(currentMetrics.starScores);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Interview Session Report
          </h1>
          <p className="text-gray-600">
            {results.role} • {results.questions.length} question{results.questions.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Overall Summary */}
        {results.overall && (
          <div className="mb-8">
            <OverallSummary overall={results.overall} />
          </div>
        )}

        {/* Question Navigation */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Question Details
          </h2>
          <QuestionPager
            total={results.questions.length}
            current={ui.reportCurrentIndex}
            onSelect={setReportIndex}
            questionStatuses={results.questions.map(q => q.metrics.status || 'answered')}
          />
        </div>

        {/* Current Question Title with Grade */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Question {ui.reportCurrentIndex + 1}
                {currentMetrics.status === 'skipped' && (
                  <span className="ml-3 px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                    Skipped
                  </span>
                )}
              </h2>
              <p className="text-gray-700">{currentQuestion.question}</p>
            </div>
            {/* Individual Question Grade Badge */}
            {currentMetrics.status !== 'skipped' && currentQuestion.grade && (
              <div className="ml-6 flex flex-col items-center justify-center min-w-[120px]">
                <div className={`text-5xl font-bold mb-1 ${
                  currentQuestion.grade === 'A' ? 'text-green-600' :
                  currentQuestion.grade === 'B' ? 'text-blue-600' :
                  currentQuestion.grade === 'C' ? 'text-yellow-600' :
                  currentQuestion.grade === 'D' ? 'text-orange-600' :
                  'text-red-600'
                }`}>
                  {currentQuestion.grade}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {currentQuestion.overallScore}/100
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Question Grade
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Show metrics only if not skipped */}
        {currentMetrics.status !== 'skipped' ? (
          <>
            {/* Key Metrics */}
            <div className="grid md:grid-cols-5 gap-6 mb-8">
              <MetricCard
                title="Overall Grade"
                value={currentQuestion.grade || 'N/A'}
                subtitle={`${currentQuestion.overallScore || 0}/100 composite`}
                color={
                  (currentQuestion.grade === 'A' || currentQuestion.grade === 'B')
                    ? 'green'
                    : (currentQuestion.grade === 'C' || currentQuestion.grade === 'D')
                    ? 'yellow'
                    : 'red'
                }
              />

              <MetricCard
                title="Speaking Pace"
                value={`${currentMetrics.wpm}`}
                subtitle="words per minute"
                color={
                  currentMetrics.wpm >= 110 && currentMetrics.wpm <= 150
                    ? 'green'
                    : currentMetrics.wpm < 90 || currentMetrics.wpm > 170
                    ? 'red'
                    : 'yellow'
                }
              />

              <MetricCard
                title="Filler Words"
                value={String(currentMetrics.fillerCount)}
                subtitle={`${(currentMetrics.fillerCount / Math.max(1, currentQuestion.durationMs / 60000)).toFixed(1)} per minute`}
                color={
                  currentMetrics.fillerCount / Math.max(1, currentQuestion.durationMs / 60000) < 2
                    ? 'green'
                    : currentMetrics.fillerCount / Math.max(1, currentQuestion.durationMs / 60000) < 5
                    ? 'yellow'
                    : 'red'
                }
              />

              <MetricCard
                title="Attention"
                value={`${Math.round(currentMetrics.attentionScore)}%`}
                subtitle={currentMetrics.attentionScore >= 80 ? 'excellent' : currentMetrics.attentionScore >= 60 ? 'good' : 'needs work'}
                color={
                  currentMetrics.attentionScore >= 80
                    ? 'green'
                    : currentMetrics.attentionScore >= 60
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
            {currentMetrics.relevance && (
              <div className="mb-8">
                <RelevanceCard relevance={currentMetrics.relevance} />
              </div>
            )}

            {/* Detailed Analysis */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* STAR Breakdown */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <StarBars scores={currentMetrics.starScores} />
              </div>

              {/* Transcript */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Transcript
                </h3>
                {currentQuestion.transcript ? (
                  <div className="text-sm text-gray-700 max-h-64 overflow-y-auto">
                    {currentQuestion.transcript}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    No transcript available.
                  </p>
                )}
              </div>
            </div>

            {/* Suggestions */}
            {allSuggestions.length > 0 && (
              <FeedbackPanel suggestions={allSuggestions} className="mb-8" />
            )}
          </>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <p className="text-yellow-800">
              This question was skipped. No metrics available.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleDownloadJSON}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Export All (JSON)
          </button>

          <button
            onClick={handleDownloadCSV}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Export All (CSV)
          </button>

          <button
            onClick={handleNewSession}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors ml-auto"
          >
            New Session
          </button>
        </div>
      </div>
    </div>
  );
}
