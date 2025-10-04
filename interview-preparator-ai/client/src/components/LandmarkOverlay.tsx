/**
 * Canvas overlay for rendering face mesh landmarks
 */

import { useEffect, useRef } from 'react';
import type { Results } from '@mediapipe/face_mesh';

interface LandmarkOverlayProps {
  landmarks: Results | null;
  width?: number;
  height?: number;
  className?: string;
}

export function LandmarkOverlay({
  landmarks,
  width = 640,
  height = 480,
  className = '',
}: LandmarkOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !landmarks) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw face mesh if available
    if (landmarks.multiFaceLandmarks && landmarks.multiFaceLandmarks.length > 0) {
      const face = landmarks.multiFaceLandmarks[0];

      // Draw landmarks
      ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
      for (const landmark of face) {
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
        if (face[idx]) {
          const x = face[idx].x * width;
          const y = face[idx].y * height;
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, 2 * Math.PI);
          ctx.fill();
        }
      }

      // Draw head pose indicator (simple line from nose)
      const nose = face[1];
      const leftEye = face[33];
      const rightEye = face[263];

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
  }, [landmarks, width, height]);

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
