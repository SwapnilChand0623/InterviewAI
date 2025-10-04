/**
 * Hook for MediaPipe Face Mesh tracking
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { FaceMesh, Results } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import { calculateVariance } from '@/lib/utils';

export interface HeadPoseMetrics {
  yaw: number; // Left-right rotation
  pitch: number; // Up-down rotation
  roll: number; // Tilt rotation
}

export interface FaceMeshState {
  isInitialized: boolean;
  isTracking: boolean;
  landmarks: Results | null;
  headPose: HeadPoseMetrics | null;
  headVariance: number;
  gazeDrift: number;
  attentionScore: number;
  error: string | null;
}

export interface FaceMeshControls {
  startTracking: (videoElement: HTMLVideoElement) => Promise<void>;
  stopTracking: () => void;
  getMetrics: () => { headVariance: number; gazeDrift: number; attentionScore: number };
}

/**
 * Calculate head pose from face landmarks
 */
function calculateHeadPose(landmarks: Results): HeadPoseMetrics | null {
  if (!landmarks.multiFaceLandmarks || landmarks.multiFaceLandmarks.length === 0) {
    return null;
  }

  const face = landmarks.multiFaceLandmarks[0];

  // Key landmark indices for head pose estimation
  const nose = face[1]; // Nose tip
  const leftEye = face[33]; // Left eye outer corner
  const rightEye = face[263]; // Right eye outer corner
  const leftMouth = face[61]; // Left mouth corner
  const rightMouth = face[291]; // Right mouth corner

  // Calculate yaw (left-right rotation) from eye positions
  const eyeDiffX = rightEye.x - leftEye.x;
  const yaw = Math.atan2(nose.x - (leftEye.x + rightEye.x) / 2, eyeDiffX) * (180 / Math.PI);

  // Calculate pitch (up-down rotation) from vertical positions
  const eyeCenterY = (leftEye.y + rightEye.y) / 2;
  const mouthCenterY = (leftMouth.y + rightMouth.y) / 2;
  const pitch = Math.atan2(nose.y - eyeCenterY, mouthCenterY - eyeCenterY) * (180 / Math.PI);

  // Calculate roll (tilt) from eye alignment
  const roll = Math.atan2(rightEye.y - leftEye.y, eyeDiffX) * (180 / Math.PI);

  return { yaw, pitch, roll };
}

/**
 * Calculate gaze drift (eye center movement)
 */
function calculateGazeDrift(landmarks: Results, baselineGaze: { x: number; y: number } | null): number {
  if (!landmarks.multiFaceLandmarks || landmarks.multiFaceLandmarks.length === 0) {
    return 0;
  }

  const face = landmarks.multiFaceLandmarks[0];
  const leftEye = face[33];
  const rightEye = face[263];

  const gazeX = (leftEye.x + rightEye.x) / 2;
  const gazeY = (leftEye.y + rightEye.y) / 2;

  if (!baselineGaze) {
    return 0;
  }

  // Calculate drift in pixels (assume 640x480 reference)
  const driftX = (gazeX - baselineGaze.x) * 640;
  const driftY = (gazeY - baselineGaze.y) * 480;

  return Math.sqrt(driftX * driftX + driftY * driftY);
}

/**
 * Hook for Face Mesh tracking
 */
export function useFaceMesh(): [FaceMeshState, FaceMeshControls] {
  const [state, setState] = useState<FaceMeshState>({
    isInitialized: false,
    isTracking: false,
    landmarks: null,
    headPose: null,
    headVariance: 0,
    gazeDrift: 0,
    attentionScore: 100,
    error: null,
  });

  const faceMeshRef = useRef<FaceMesh | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const headPoseHistoryRef = useRef<HeadPoseMetrics[]>([]);
  const baselineGazeRef = useRef<{ x: number; y: number } | null>(null);
  const gazeDriftsRef = useRef<number[]>([]);

  // Initialize FaceMesh once
  useEffect(() => {
    const faceMesh = new FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      },
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results: Results) => {
      const headPose = calculateHeadPose(results);

      // Track head pose history for variance calculation
      if (headPose) {
        headPoseHistoryRef.current.push(headPose);
        if (headPoseHistoryRef.current.length > 30) {
          headPoseHistoryRef.current.shift(); // Keep last 30 frames (~1 sec at 30fps)
        }
      }

      // Calculate head variance
      const yaws = headPoseHistoryRef.current.map((p) => p.yaw);
      const pitches = headPoseHistoryRef.current.map((p) => p.pitch);
      const headVariance =
        (calculateVariance(yaws) + calculateVariance(pitches)) / 2;

      // Set baseline gaze on first detection
      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const face = results.multiFaceLandmarks[0];
        const leftEye = face[33];
        const rightEye = face[263];

        if (!baselineGazeRef.current) {
          baselineGazeRef.current = {
            x: (leftEye.x + rightEye.x) / 2,
            y: (leftEye.y + rightEye.y) / 2,
          };
        }
      }

      // Calculate gaze drift
      const gazeDrift = calculateGazeDrift(results, baselineGazeRef.current);
      gazeDriftsRef.current.push(gazeDrift);
      if (gazeDriftsRef.current.length > 30) {
        gazeDriftsRef.current.shift();
      }

      const avgGazeDrift =
        gazeDriftsRef.current.reduce((sum, val) => sum + val, 0) / gazeDriftsRef.current.length;

      // Calculate attention score (inverse of variance + drift)
      const attentionScore = Math.max(
        0,
        Math.min(100, 100 - headVariance * 0.5 - avgGazeDrift * 0.5)
      );

      setState((prev) => ({
        ...prev,
        landmarks: results,
        headPose,
        headVariance,
        gazeDrift: avgGazeDrift,
        attentionScore,
      }));
    });

    faceMeshRef.current = faceMesh;

    setState((prev) => ({ ...prev, isInitialized: true }));

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
    };
  }, []);

  const startTracking = useCallback(async (videoElement: HTMLVideoElement) => {
    if (!faceMeshRef.current) {
      setState((prev) => ({ ...prev, error: 'FaceMesh not initialized' }));
      return;
    }

    try {
      const camera = new Camera(videoElement, {
        onFrame: async () => {
          if (faceMeshRef.current) {
            await faceMeshRef.current.send({ image: videoElement });
          }
        },
        width: 1280,
        height: 720,
      });

      await camera.start();
      cameraRef.current = camera;

      setState((prev) => ({ ...prev, isTracking: true, error: null }));
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to start face tracking';
      setState((prev) => ({ ...prev, error, isTracking: false }));
    }
  }, []);

  const stopTracking = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }

    setState((prev) => ({ ...prev, isTracking: false }));
  }, []);

  const getMetrics = useCallback(() => {
    return {
      headVariance: state.headVariance,
      gazeDrift: state.gazeDrift,
      attentionScore: state.attentionScore,
    };
  }, [state.headVariance, state.gazeDrift, state.attentionScore]);

  return [
    state,
    {
      startTracking,
      stopTracking,
      getMetrics,
    },
  ];
}
