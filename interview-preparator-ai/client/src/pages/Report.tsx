/**
 * Report page - Display analysis results
 */

import { useNavigate } from 'react-router-dom';
import { useStore } from '@/features/state/store';
import { MetricCard } from '@/components/MetricCard';
import { StarBars } from '@/components/StarBars';
import { FeedbackPanel } from '@/components/FeedbackPanel';
import { getTextSuggestions } from '@/features/analysis/text';
import { getOverallStarScore } from '@/features/analysis/star';
import { getAttentionSuggestions } from '@/features/analysis/attention';
import { downloadJSON, downloadCSV } from '@/lib/utils';
import { saveSession, type CompletedSession } from '@/lib/sessionStorage';
import { useEffect } from 'react';

export function Report() {
  const navigate = useNavigate();
  const { session, metrics, reset } = useStore();

  // Redirect if no metrics and no session answers
  useEffect(() => {
    if (!metrics.textMetrics && !metrics.starScores && metrics.sessionAnswers.length === 0) {
      navigate('/');
    }
  }, [metrics, navigate]);

  // Save session to history on mount
  useEffect(() => {
    if (session.role && session.startTime && session.endTime && metrics.sessionAnswers.length > 0) {
      const completedSession: CompletedSession = {
        id: `session_${session.startTime}`,
        role: session.role,
        startTime: session.startTime,
        endTime: session.endTime,
        totalDuration: (session.endTime - session.startTime) / 1000,
        answers: metrics.sessionAnswers,
        questionCount: metrics.sessionAnswers.length,
      };
      
      saveSession(completedSession);
    }
  }, []);

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
    if (metrics.sessionAnswers.length === 0) {
      return;
    }

    const data = metrics.sessionAnswers.map((answer, index) => ({
      questionNumber: index + 1,
      questionId: answer.questionId,
      question: answer.question,
      duration: (answer.endTime - answer.startTime) / 1000,
      wpm: answer.textMetrics?.wpm || 0,
      fillerCount: answer.textMetrics?.fillerCount || 0,
      attentionScore: answer.attentionMetrics?.attentionScore || 0,
      starS: answer.starScores?.S || 0,
      starT: answer.starScores?.T || 0,
      starA: answer.starScores?.A || 0,
      starR: answer.starScores?.R || 0,
      overallStarScore: answer.starScores ? getOverallStarScore(answer.starScores) : 0,
    }));

    downloadCSV(data, `interview-metrics-${Date.now()}.csv`);
  };

  // Use the last answer or aggregated metrics
  const calculateAverageMetrics = () => {
    if (metrics.sessionAnswers.length === 0) {
      return {
        avgWpm: 0,
        avgFillerCount: 0,
        avgAttention: 0,
        avgStarScore: 0,
      };
    }

    let totalWpm = 0;
    let totalFillers = 0;
    let totalAttention = 0;
    let totalStarScore = 0;
    let count = metrics.sessionAnswers.length;

    metrics.sessionAnswers.forEach(answer => {
      if (answer.textMetrics) {
        totalWpm += answer.textMetrics.wpm;
        totalFillers += answer.textMetrics.fillerCount;
      }
      if (answer.attentionMetrics) {
        totalAttention += answer.attentionMetrics.attentionScore;
      }
      if (answer.starScores) {
        totalStarScore += getOverallStarScore(answer.starScores);
      }
    });

    return {
      avgWpm: totalWpm / count,
      avgFillerCount: totalFillers / count,
      avgAttention: totalAttention / count,
      avgStarScore: totalStarScore / count,
    };
  };

  const avgMetrics = calculateAverageMetrics();

  // Collect all suggestions from all answers
  const allSuggestions: string[] = [];
  metrics.sessionAnswers.forEach(answer => {
    if (answer.textMetrics) {
      allSuggestions.push(...getTextSuggestions(answer.textMetrics));
    }
    if (answer.attentionMetrics) {
      allSuggestions.push(...getAttentionSuggestions(answer.attentionMetrics));
    }
  });

  // Remove duplicates
  const uniqueSuggestions = Array.from(new Set(allSuggestions));

  if (metrics.sessionAnswers.length === 0 && !metrics.textMetrics) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Interview Report
          </h1>
          <p className="text-gray-600">
            Session Summary: {metrics.sessionAnswers.length} question{metrics.sessionAnswers.length !== 1 ? 's' : ''} answered
          </p>
        </div>

        {/* Session Overview */}
        {metrics.sessionAnswers.length > 1 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Session Overview</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Avg. Speaking Pace</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(avgMetrics.avgWpm)} WPM</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Filler Words</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(avgMetrics.avgFillerCount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Attention</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(avgMetrics.avgAttention)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. STAR Score</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(avgMetrics.avgStarScore)}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Individual Question Results */}
        {metrics.sessionAnswers.map((answer, index) => (
          <div key={answer.questionId} className="mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg p-4">
              <h2 className="text-xl font-bold">Question {index + 1}</h2>
            </div>
            
            <div className="bg-white rounded-b-lg shadow-sm p-6">
              {/* Question Text */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Question</h3>
                <p className="text-lg text-gray-900">{answer.question}</p>
              </div>

              {/* Metrics for this question */}
              {answer.textMetrics && answer.starScores && answer.attentionMetrics && (
                <>
                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <MetricCard
                      title="Speaking Pace"
                      value={`${answer.textMetrics.wpm}`}
                      subtitle="words per minute"
                      color={
                        answer.textMetrics.paceRating === 'good'
                          ? 'green'
                          : answer.textMetrics.paceRating === 'slow'
                          ? 'yellow'
                          : 'red'
                      }
                    />

                    <MetricCard
                      title="Filler Words"
                      value={`${answer.textMetrics.fillerCount}`}
                      subtitle={`${answer.textMetrics.fillerRate.toFixed(1)}% of words`}
                      color={
                        answer.textMetrics.fillerCount < 3
                          ? 'green'
                          : answer.textMetrics.fillerCount < 8
                          ? 'yellow'
                          : 'red'
                      }
                    />

                    <MetricCard
                      title="Attention Score"
                      value={`${Math.round(answer.attentionMetrics.attentionScore)}%`}
                      subtitle={answer.attentionMetrics.movementRating}
                      color={
                        answer.attentionMetrics.movementRating === 'stable'
                          ? 'green'
                          : answer.attentionMetrics.movementRating === 'moderate'
                          ? 'yellow'
                          : 'red'
                      }
                    />

                    <MetricCard
                      title="STAR Score"
                      value={`${Math.round(getOverallStarScore(answer.starScores))}%`}
                      subtitle="overall structure"
                      color={
                        getOverallStarScore(answer.starScores) >= 70
                          ? 'green'
                          : getOverallStarScore(answer.starScores) >= 50
                          ? 'yellow'
                          : 'red'
                      }
                    />
                  </div>

                  {/* STAR Breakdown */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">STAR Framework Analysis</h3>
                    <StarBars scores={answer.starScores} />
                  </div>

                  {/* Transcript */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Transcript</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {answer.transcript || (
                          <span className="italic text-gray-400">
                            No transcript available
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}

        {/* Overall Feedback */}
        {uniqueSuggestions.length > 0 && (
          <div className="mb-8">
            <FeedbackPanel suggestions={uniqueSuggestions} />
          </div>
        )}

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
