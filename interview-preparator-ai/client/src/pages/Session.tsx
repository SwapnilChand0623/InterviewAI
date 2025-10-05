/**
 * Session page - Active interview recording
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/features/state/store';
import { useCapture } from '@/features/capture/useCapture';
import { useSpeech } from '@/features/speech/useSpeech';
import { useFaceMesh } from '@/features/landmarks/useFaceMesh';
import { CameraPreview } from '@/components/CameraPreview';
import { LandmarkOverlay } from '@/components/LandmarkOverlay';
import { Timer } from '@/components/Timer';
import { RecorderControls } from '@/components/RecorderControls';

export function Session() {
  const navigate = useNavigate();
  const { session, endSession, computeMetrics, getCurrentQuestion, nextQuestion, saveCurrentAnswer } = useStore();
  const [isRecording, setIsRecording] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const currentQuestion = getCurrentQuestion();

  // Hooks
  const [captureState, captureControls] = useCapture();
  const [speechState, speechControls] = useSpeech({
    continuous: true,
    interimResults: true,
  });
  const [faceMeshState, faceMeshControls] = useFaceMesh();

  // Redirect if no question selected
  useEffect(() => {
    if (!currentQuestion) {
      navigate('/');
    }
  }, [currentQuestion, navigate]);

  // Start capture on mount
  useEffect(() => {
    captureControls.startCapture();

    return () => {
      captureControls.stopCapture();
      speechControls.stopListening();
      faceMeshControls.stopTracking();
    };
  }, []);

  const handleStart = async () => {
    setIsRecording(true);
    setStartTime(Date.now());
    
    speechControls.startListening();
  };

  const handleStop = async () => {
    setIsRecording(false);
    
    speechControls.stopListening();

    // Calculate duration
    const duration = startTime ? (Date.now() - startTime) / 1000 : session.duration;

    // Get metrics
    const { headVariance, gazeDrift } = faceMeshControls.getMetrics();

    // Compute final metrics for current question
    await computeMetrics(
      speechState.transcript,
      duration,
      headVariance,
      gazeDrift
    );

    // Save the current answer
    saveCurrentAnswer();

    // Check if there are more questions
    const hasMore = nextQuestion();
    
    if (!hasMore) {
      // No more questions, end session
      faceMeshControls.stopTracking();
      captureControls.stopCapture();
      endSession();
      navigate('/report');
    } else {
      // Reset for next question
      setStartTime(null);
      setIsRecording(false);
    }
  };

  const handleSkipQuestion = async () => {
    if (!isRecording) {
      // If not recording, just move to next question
      const hasMore = nextQuestion();
      if (!hasMore) {
        faceMeshControls.stopTracking();
        captureControls.stopCapture();
        endSession();
        navigate('/report');
      }
    } else {
      // If recording, stop and save first
      await handleStop();
    }
  };

  const handleVideoReady = (videoElement: HTMLVideoElement) => {
    // Start face tracking when video is ready
    if (faceMeshState.isInitialized) {
      faceMeshControls.startTracking(videoElement);
    }
  };

  if (!currentQuestion) {
    return null;
  }

  const currentQuestionNum = session.currentQuestionIndex + 1;
  const totalQuestions = session.questions.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mock Interview Session
          </h1>
          <p className="text-gray-600">
            Role: {session.role?.replace('_', ' ').toUpperCase()}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Question {currentQuestionNum} of {totalQuestions}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Video */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Camera Preview
              </h2>
              
              <div className="relative aspect-video">
                <CameraPreview
                  stream={captureState.stream}
                  isActive={captureState.isCapturing}
                  onVideoReady={handleVideoReady}
                  className="w-full h-full"
                />
                
                {faceMeshState.isTracking && (
                  <LandmarkOverlay
                    landmarks={faceMeshState.landmarks}
                    width={640}
                    height={480}
                    className="w-full h-full"
                  />
                )}
              </div>

              {captureState.error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  {captureState.error}
                </div>
              )}

              {speechState.error && !speechState.isSupported && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                  Speech recognition unavailable. Transcript will not be captured.
                </div>
              )}
            </div>

            {/* Live Metrics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Live Metrics
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Attention Score</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(faceMeshState.attentionScore)}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Words Spoken</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {speechState.transcript.split(/\s+/).filter(w => w).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Question & Controls */}
          <div className="space-y-6">
            {/* Question */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-sm font-medium text-gray-500">
                  Question {currentQuestionNum} of {totalQuestions}
                </h2>
                <span className="text-xs text-gray-400">ID: {currentQuestion.id}</span>
              </div>
              <p className="text-xl font-medium text-gray-900">
                {currentQuestion.q}
              </p>
            </div>

            {/* Timer */}
            <div className="bg-white rounded-lg shadow-sm p-6 flex justify-center">
              <Timer
                duration={session.duration}
                isRunning={isRecording}
                onComplete={handleStop}
              />
            </div>

            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <RecorderControls
                isRecording={isRecording}
                isDisabled={!captureState.isCapturing}
                onStart={handleStart}
                onStop={handleStop}
              />

              {/* Next Question Button */}
              {currentQuestionNum < totalQuestions && (
                <button
                  onClick={handleSkipQuestion}
                  className="w-full mt-3 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  {isRecording ? 'Finish & Next Question' : 'Skip to Next Question'}
                </button>
              )}

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Tip:</span> Take a moment to think,
                  then click "Start Recording" when you're ready to answer. Use the STAR
                  framework to structure your response.
                </p>
              </div>
            </div>

            {/* Live Transcript */}
            {speechState.isSupported && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Live Transcript
                </h3>
                <div className="bg-gray-50 rounded p-4 max-h-60 overflow-y-auto">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {speechState.transcript || speechState.interimTranscript || (
                      <span className="text-gray-400 italic">
                        Transcript will appear here as you speak...
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
