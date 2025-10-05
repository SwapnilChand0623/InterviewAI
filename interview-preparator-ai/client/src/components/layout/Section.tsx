/**
 * Section component for page sections
 */

import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

const spacingStyles = {
  none: '',
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-16',
};

export function Section({ children, className, spacing = 'md' }: SectionProps) {
  return (
    <section className={cn(spacingStyles[spacing], className)}>
      {children}
    </section>
  );
}
