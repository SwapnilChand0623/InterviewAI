/**
 * Session History page - View past sessions and analytics
 */

import { useNavigate } from 'react-router-dom';
import { loadSessionHistory, calculateAverageMetrics, clearSessionHistory } from '@/lib/sessionStorage';
import { getOverallStarScore } from '@/features/analysis/star';
import { useState } from 'react';

export function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState(loadSessionHistory());
  const avgMetrics = calculateAverageMetrics();

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all session history? This cannot be undone.')) {
      clearSessionHistory();
      setHistory(loadSessionHistory());
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Session History
            </h1>
            <p className="text-gray-600">
              Review your past interview practice sessions
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            New Session
          </button>
        </div>

        {/* Overall Statistics */}
        {history.sessions.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Overall Statistics</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary-600">{history.totalSessions}</p>
                <p className="text-sm text-gray-600 mt-1">Total Sessions</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary-600">{history.totalQuestions}</p>
                <p className="text-sm text-gray-600 mt-1">Questions Answered</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary-600">
                  {Math.round(avgMetrics.avgAttention)}%
                </p>
                <p className="text-sm text-gray-600 mt-1">Avg. Attention</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary-600">
                  {Math.round(avgMetrics.avgStarScore)}%
                </p>
                <p className="text-sm text-gray-600 mt-1">Avg. STAR Score</p>
              </div>
            </div>
          </div>
        )}

        {/* Session List */}
        {history.sessions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Sessions Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start your first mock interview session to see your history here
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Start Your First Session
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {history.sessions.map((session) => {
              const avgSessionMetrics = {
                wpm: session.answers.reduce((sum, a) => sum + (a.textMetrics?.wpm || 0), 0) / session.answers.length,
                attention: session.answers.reduce((sum, a) => sum + (a.attentionMetrics?.attentionScore || 0), 0) / session.answers.length,
                starScore: session.answers.reduce((sum, a) => sum + (a.starScores ? getOverallStarScore(a.starScores) : 0), 0) / session.answers.length,
              };

              return (
                <div key={session.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {session.role?.replace('_', ' ').toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(session.startTime)} • {formatDuration(session.totalDuration)}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {session.questionCount} question{session.questionCount > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Avg. WPM</p>
                      <p className="text-xl font-bold text-gray-900">
                        {Math.round(avgSessionMetrics.wpm)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Avg. Attention</p>
                      <p className="text-xl font-bold text-gray-900">
                        {Math.round(avgSessionMetrics.attention)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Avg. STAR Score</p>
                      <p className="text-xl font-bold text-gray-900">
                        {Math.round(avgSessionMetrics.starScore)}%
                      </p>
                    </div>
                  </div>

                  {/* Questions Preview */}
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Questions:</p>
                    <div className="space-y-2">
                      {session.answers.slice(0, 3).map((answer, idx) => (
                        <div key={answer.questionId} className="text-sm text-gray-600">
                          {idx + 1}. {answer.question.substring(0, 80)}
                          {answer.question.length > 80 ? '...' : ''}
                        </div>
                      ))}
                      {session.answers.length > 3 && (
                        <p className="text-sm text-gray-500 italic">
                          +{session.answers.length - 3} more question{session.answers.length - 3 > 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Clear History Button */}
            <div className="text-center pt-6">
              <button
                onClick={handleClearHistory}
                className="px-6 py-2 text-red-600 hover:text-red-700 font-medium"
              >
                Clear All History
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
