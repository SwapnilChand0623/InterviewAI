/**
 * Camera preview component with video display
 */

import { useEffect, useRef } from 'react';

interface CameraPreviewProps {
  stream: MediaStream | null;
  isActive: boolean;
  onVideoReady?: (videoElement: HTMLVideoElement) => void;
  className?: string;
}

export function CameraPreview({
  stream,
  isActive,
  onVideoReady,
  className = '',
}: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    if (stream && isActive) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((err) => {
        console.error('Failed to play video:', err);
      });

      if (onVideoReady) {
        onVideoReady(videoRef.current);
      }
    } else {
      videoRef.current.srcObject = null;
    }
  }, [stream, isActive, onVideoReady]);

  return (
    <div className={`relative bg-gray-900 rounded-lg overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
        style={{ transform: 'scaleX(-1)' }} // Mirror the video
      />
      
      {!isActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-gray-400">Camera not active</p>
          </div>
        </div>
      )}
    </div>
  );
}
