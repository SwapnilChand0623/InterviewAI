/**
 * Card component for consistent container styling
 */

import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'bordered' | 'elevated';
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const variantStyles = {
  default: 'bg-white dark:bg-slate-800 rounded-2xl shadow-sm',
  bordered: 'bg-white dark:bg-slate-800 rounded-2xl border-2 border-gray-200 dark:border-slate-700',
  elevated: 'bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200',
};

export function Card({ 
  children, 
  className, 
  padding = 'md',
  variant = 'default' 
}: CardProps) {
  return (
    <div className={cn(variantStyles[variant], paddingStyles[padding], className)}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('mt-4', className)}>
      {children}
    </div>
  );
}
