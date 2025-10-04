/**
 * Hook for managing getUserMedia video/audio capture
 */

import { useState, useRef, useCallback } from 'react';

export interface CaptureState {
  stream: MediaStream | null;
  isCapturing: boolean;
  error: string | null;
  hasPermission: boolean;
}

export interface CaptureControls {
  startCapture: () => Promise<void>;
  stopCapture: () => void;
  getVideoElement: () => HTMLVideoElement | null;
}

export function useCapture(): [CaptureState, CaptureControls] {
  const [state, setState] = useState<CaptureState>({
    stream: null,
    isCapturing: false,
    error: null,
    hasPermission: false,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCapture = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, error: null }));

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: true,
      });

      streamRef.current = stream;

      setState({
        stream,
        isCapturing: true,
        error: null,
        hasPermission: true,
      });
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to access camera/microphone';
      setState({
        stream: null,
        isCapturing: false,
        error,
        hasPermission: false,
      });
    }
  }, []);

  const stopCapture = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setState({
      stream: null,
      isCapturing: false,
      error: null,
      hasPermission: true, // Keep permission status
    });
  }, []);

  const getVideoElement = useCallback(() => {
    return videoRef.current;
  }, []);

  return [
    state,
    {
      startCapture,
      stopCapture,
      getVideoElement,
    },
  ];
}

/**
 * Set video element reference for the capture hook
 */
export function setVideoElement(
  videoElement: HTMLVideoElement | null,
  ref: React.MutableRefObject<HTMLVideoElement | null>
): void {
  ref.current = videoElement;
}
