/**
 * Toast notification component
 */

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  onClose?: () => void;
  onCancel?: () => void;
  duration?: number;
  type?: 'info' | 'success' | 'warning' | 'error';
}

const typeStyles = {
  info: 'bg-blue-50 border-blue-200 text-blue-900',
  success: 'bg-green-50 border-green-200 text-green-900',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
  error: 'bg-red-50 border-red-200 text-red-900',
};

export function Toast({
  message,
  onClose,
  onCancel,
  duration = 3000,
  type = 'info',
}: ToastProps) {
  useEffect(() => {
    if (!onClose) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 shadow-lg ${typeStyles[type]} max-w-md`}
      >
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="px-3 py-1 text-sm font-semibold rounded hover:bg-black/5 transition-colors"
          >
            Cancel
          </button>
        )}

        {onClose && !onCancel && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
