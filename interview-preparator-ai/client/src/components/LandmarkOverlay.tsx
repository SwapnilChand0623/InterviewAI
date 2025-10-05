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
      // Face tracking active but no visual overlay for cleaner preview
      // All landmarks, keypoints, and head pose indicators removed
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
