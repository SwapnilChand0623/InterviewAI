/**
 * Question pager for multi-question report navigation
 */

import { useEffect } from 'react';

interface QuestionPagerProps {
  total: number;
  current: number;
  onSelect: (index: number) => void;
  questionStatuses?: Array<'answered' | 'skipped' | 'timeout'>;
}

export function QuestionPager({
  total,
  current,
  onSelect,
  questionStatuses = [],
}: QuestionPagerProps) {
  // Keyboard navigation: [ for prev, ] for next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '[' && current > 0) {
        onSelect(current - 1);
      } else if (e.key === ']' && current < total - 1) {
        onSelect(current + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [current, total, onSelect]);

  const canGoPrev = current > 0;
  const canGoNext = current < total - 1;

  const getStatusColor = (status?: 'answered' | 'skipped' | 'timeout') => {
    switch (status) {
      case 'answered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'skipped':
        return 'bg-gray-100 text-gray-600 border-gray-300';
      case 'timeout':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {/* Prev button */}
      <button
        onClick={() => canGoPrev && onSelect(current - 1)}
        disabled={!canGoPrev}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          canGoPrev
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
        aria-label="Previous question"
      >
        ← Prev
      </button>

      {/* Question chips */}
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: total }, (_, i) => {
          const isActive = i === current;
          const status = questionStatuses[i];

          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={`w-10 h-10 rounded-lg font-semibold border-2 transition-all ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 scale-110 shadow-lg'
                  : `${getStatusColor(status)} hover:scale-105`
              }`}
              aria-label={`Go to question ${i + 1}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Next button */}
      <button
        onClick={() => canGoNext && onSelect(current + 1)}
        disabled={!canGoNext}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          canGoNext
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
        aria-label="Next question"
      >
        Next →
      </button>

      {/* Keyboard hint */}
      <div className="text-xs text-gray-500 ml-auto">
        Use [ ] keys to navigate
      </div>
    </div>
  );
}
