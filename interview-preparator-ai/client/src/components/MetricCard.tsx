/**
 * Metric display card component
 */

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  className?: string;
}

const colorClasses = {
  blue: 'bg-blue-50 border-blue-200 text-blue-900',
  green: 'bg-green-50 border-green-200 text-green-900',
  yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900',
  red: 'bg-red-50 border-red-200 text-red-900',
  gray: 'bg-gray-50 border-gray-200 text-gray-900',
};

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  color = 'blue',
  className = '',
}: MetricCardProps) {
  return (
    <div
      className={`rounded-lg border-2 p-6 ${colorClasses[color]} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm opacity-75">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="ml-4 opacity-50">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
