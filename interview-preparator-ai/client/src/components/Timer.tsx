/**
 * Countdown timer component
 */

import { useEffect, useState, useRef } from 'react';
import { formatTime } from '@/lib/utils';

interface TimerProps {
  duration: number; // Total duration in seconds
  isRunning: boolean;
  isPaused?: boolean; // New: support external pause
  onTick?: (remaining: number) => void;
  onComplete?: () => void;
}

export function Timer({ duration, isRunning, isPaused = false, onTick, onComplete }: TimerProps) {
  const [remaining, setRemaining] = useState(duration);
  const onTickRef = useRef(onTick);
  const onCompleteRef = useRef(onComplete);

  // Keep refs up to date
  useEffect(() => {
    onTickRef.current = onTick;
    onCompleteRef.current = onComplete;
  }, [onTick, onComplete]);

  useEffect(() => {
    setRemaining(duration);
  }, [duration]);

  useEffect(() => {
    // Don't tick if not running OR if paused
    if (!isRunning || isPaused) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;
        
        if (onTickRef.current) {
          onTickRef.current(next);
        }

        if (next <= 0) {
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
          return 0;
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  const percentage = (remaining / duration) * 100;
  const isLowTime = remaining <= 30;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 56}`}
            strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentage / 100)}`}
            className={`transition-all ${isLowTime ? 'text-red-500' : 'text-primary-500'}`}
            strokeLinecap="round"
          />
        </svg>
        {/* Time display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-3xl font-bold ${isLowTime ? 'text-red-500' : 'text-gray-900'}`}>
            {formatTime(remaining)}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-500">
        {isRunning ? 'Recording...' : 'Ready'}
      </p>
    </div>
  );
}
