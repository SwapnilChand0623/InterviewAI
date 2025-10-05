/**
 * Session page - Active interview recording with auto-end detection
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/features/state/store';
import { useCapture } from '@/features/capture/useCapture';
import { useSpeech } from '@/features/speech/useSpeech';
import { useFaceMesh } from '@/features/landmarks/useFaceMesh';
import { CameraPreview } from '@/components/CameraPreview';
import { LandmarkOverlay } from '@/components/LandmarkOverlay';
import { Timer } from '@/components/Timer';
import { RecorderControls } from '@/components/RecorderControls';
import { Toast } from '@/components/Toast';

export function Session() {
  const navigate = useNavigate();
  const { 
    session, 
    settings,
    finalizeAnswerAndScore, 
    goToNextQuestion,
    skipQuestion,
    appendTranscriptChunk,
    clearTranscriptBuffer,
    endSessionNow,
  } = useStore();
  const [isRecording, setIsRecording] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const autoAdvanceTimerRef = useRef<number | null>(null);

  // Hooks
  const [captureState, captureControls] = useCapture();
  const [faceMeshState, faceMeshControls] = useFaceMesh();
  
  // Store handleStop ref to avoid circular dependency
  const handleStopRef = useRef<(() => Promise<void>) | null>(null);

  // Auto-end handler
  const handleAutoEnd = useCallback(() => {
    if (isRecording && handleStopRef.current) {
      handleStopRef.current();
    }
  }, [isRecording]);

  const [speechState, speechControls] = useSpeech({
    continuous: true,
    interimResults: true,
    onTranscriptUpdate: appendTranscriptChunk, // Send chunks to store buffer
    onAutoEnd: handleAutoEnd,
    minSpeakMs: settings.minSpeakMs,
    silenceMs: settings.silenceMs,
  });

  // Redirect if no question selected
  useEffect(() => {
    if (!session.question) {
      navigate('/');
    }
  }, [session.question, navigate]);

  // Navigate to report when session is finished
  useEffect(() => {
    if (session.status === 'finished') {
      navigate('/report');
    }
  }, [session.status, navigate]);

  // Start capture on mount
  useEffect(() => {
    captureControls.startCapture();

    return () => {
      captureControls.stopCapture();
      speechControls.stopListening();
      faceMeshControls.stopTracking();
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStart = useCallback(() => {
    setIsRecording(true);
    setStartTime(Date.now());
    
    // Clear transcript buffer for new question
    clearTranscriptBuffer();
    speechControls.resetTranscript();
    speechControls.startListening();
  }, [speechControls, clearTranscriptBuffer]);

  const handleStop = useCallback(async () => {
    setIsRecording(false);
    setIsProcessing(true);
    
    // Cancel any pending auto-end
    speechControls.cancelAutoEnd();
    speechControls.stopListening();

    // Calculate duration
    const duration = startTime ? (Date.now() - startTime) / 1000 : session.duration;

    // Get metrics
    const { headVariance, gazeDrift } = faceMeshControls.getMetrics();

    // Finalize and score (will use transcript buffer internally)
    await finalizeAnswerAndScore(
      '', // Empty - store uses ui.currentAnswerText buffer
      duration,
      headVariance,
      gazeDrift
    );

    setIsProcessing(false);

    // Check if session finished (don't auto-advance if on last question)
    const store = useStore.getState();
    if (store.session.status === 'finished') {
      // Will navigate to report via useEffect
      return;
    }

    // Show toast and auto-advance
    if (settings.autoAdvance) {
      setShowToast(true);
      autoAdvanceTimerRef.current = window.setTimeout(() => {
        goToNextQuestion();
        setShowToast(false);
      }, settings.autoAdvanceDelayMs);
    }
  }, [
    startTime,
    session.duration,
    speechState.transcript,
    speechControls,
    faceMeshControls,
    finalizeAnswerAndScore,
    settings.autoAdvance,
    settings.autoAdvanceDelayMs,
    goToNextQuestion,
  ]);

  // Update ref when handleStop changes
  useEffect(() => {
    handleStopRef.current = handleStop;
  }, [handleStop]);

  const handleSkip = useCallback(() => {
    // Clear auto-advance timer if running
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }

    // Cancel any pending auto-end detection
    speechControls.cancelAutoEnd();

    // If recording, stop speech (but keep camera on)
    if (isRecording) {
      setIsRecording(false);
      speechControls.stopListening();
      // DON'T stop face tracking - let it continue for next question
    }

    // Skip to next question (camera stays on)
    skipQuestion();
    setShowToast(false);

    // Show brief toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1000);
  }, [isRecording, speechControls, skipQuestion]);

  const handleCancelAutoAdvance = useCallback(() => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    setShowToast(false);
    // Navigate to report instead
    navigate('/report');
  }, [navigate]);

  // Handle session timeout - end entire session when timer expires
  const handleSessionTimeout = useCallback(async () => {
    // Stop speech if running
    if (isRecording) {
      speechControls.cancelAutoEnd();
      speechControls.stopListening();
      setIsRecording(false);
    }
    
    // End the entire session (will finalize current answer + navigate to report)
    await endSessionNow();
  }, [isRecording, speechControls, endSessionNow]);

  const handleVideoReady = useCallback((videoElement: HTMLVideoElement) => {
    // Start face tracking when video is ready
    if (faceMeshState.isInitialized) {
      faceMeshControls.startTracking(videoElement);
    }
  }, [faceMeshState.isInitialized, faceMeshControls]);

  if (!session.question) {
    return null;
  }

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
              <h2 className="text-sm font-medium text-gray-500 mb-2">
                Your Question
              </h2>
              <p className="text-xl font-medium text-gray-900">
                {session.question.q}
              </p>
            </div>

            {/* Timer */}
            <div className="bg-white rounded-lg shadow-sm p-6 flex justify-center">
              <Timer
                duration={session.duration}
                isRunning={isRecording}
                onComplete={handleSessionTimeout}
              />
            </div>

            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <RecorderControls
                isRecording={isRecording}
                isDisabled={!captureState.isCapturing || isProcessing}
                onStart={handleStart}
                onStop={handleStop}
                onSkip={handleSkip}
              />

              {isProcessing && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-blue-900 font-medium">
                      Analyzing your answer...
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Tip:</span> Answer will auto-end after{' '}
                  {settings.silenceMs / 1000}s of silence (minimum {settings.minSpeakMs / 1000}s speaking).
                  Use STAR framework. Press N to skip anytime.
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

        {/* Auto-advance toast or skip toast */}
        {showToast && isProcessing && (
          <Toast
            message="Analyzing your answer..."
            type="info"
          />
        )}
        {showToast && !isProcessing && settings.autoAdvance && (
          <Toast
            message={`Advancing to next question in ${settings.autoAdvanceDelayMs / 1000}s...`}
            type="success"
            onCancel={handleCancelAutoAdvance}
          />
        )}
      </div>
    </div>
  );
}
