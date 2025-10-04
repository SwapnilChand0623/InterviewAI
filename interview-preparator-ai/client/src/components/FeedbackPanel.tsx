/**
 * Feedback and suggestions panel
 */

interface FeedbackPanelProps {
  suggestions: string[];
  className?: string;
}

export function FeedbackPanel({ suggestions, className = '' }: FeedbackPanelProps) {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg border-2 border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        💡 Suggestions for Improvement
      </h3>
      
      <ul className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-semibold">
              {index + 1}
            </span>
            <p className="text-gray-700 flex-1">{suggestion}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
