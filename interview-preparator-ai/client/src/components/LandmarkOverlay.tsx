/**
 * Canvas overlay for rendering face mesh landmarks
 */

import { useEffect, useRef, useCallback } from 'react';
import type { Results } from '@mediapipe/face_mesh';
import { useSessionStore } from '@/features/state/store';

interface LandmarkOverlayProps {
  landmarks: Results | null;
  width?: number;
  height?: number;
  className?: string;
  showLandmarks?: boolean;
}

export function LandmarkOverlay({
  landmarks,
  width = 640,
  height = 480,
  className = '',
  showLandmarks: propShowLandmarks,
}: LandmarkOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { sessionSettings } = useSessionStore();
  const showLandmarks = propShowLandmarks ?? sessionSettings.showLandmarks;

  const drawLandmarks = useCallback(() => {
    if (!canvasRef.current || !landmarks) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Only draw landmarks if visibility is enabled
    if (showLandmarks) {
      // Draw landmarks
      ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
      for (const landmark of landmarks.multiFaceLandmarks[0]) {
        const x = landmark.x * width;
        const y = landmark.y * height;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, 2 * Math.PI);
        ctx.fill();
      }

      // Draw key points (eyes, nose, mouth) larger
      const keyPoints = [
        1,   // Nose tip
        33,  // Left eye outer
        133, // Left eye inner
        263, // Right eye outer
        362, // Right eye inner
        61,  // Left mouth
        291, // Right mouth
      ];

      ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
      for (const idx of keyPoints) {
        if (landmarks.multiFaceLandmarks[0][idx]) {
          const x = landmarks.multiFaceLandmarks[0][idx].x * width;
          const y = landmarks.multiFaceLandmarks[0][idx].y * height;
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, 2 * Math.PI);
          ctx.fill();
        }
      }

      // Draw head pose indicator (simple line from nose)
      const nose = landmarks.multiFaceLandmarks[0][1];
      const leftEye = landmarks.multiFaceLandmarks[0][33];
      const rightEye = landmarks.multiFaceLandmarks[0][263];

      if (nose && leftEye && rightEye) {
        const eyeCenterX = ((leftEye.x + rightEye.x) / 2) * width;
        const eyeCenterY = ((leftEye.y + rightEye.y) / 2) * height;
        const noseX = nose.x * width;
        const noseY = nose.y * height;

        // Draw line from eye center to nose
        ctx.strokeStyle = 'rgba(0, 150, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(eyeCenterX, eyeCenterY);
        ctx.lineTo(noseX, noseY);
        ctx.stroke();
      }
    }
  }, [landmarks, showLandmarks, width, height]);

  useEffect(() => {
    drawLandmarks();
  }, [drawLandmarks]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ transform: 'scaleX(-1)' }} // Mirror to match video
    />
  );
}
