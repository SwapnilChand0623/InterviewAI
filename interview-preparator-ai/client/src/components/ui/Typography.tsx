/**
 * Typography components for consistent text styling across the application
 */

import { cn } from '@/lib/utils';

interface HeadingProps {
  level: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const headingStyles = {
  1: 'text-4xl md:text-5xl font-bold leading-tight',
  2: 'text-3xl md:text-4xl font-semibold leading-tight',
  3: 'text-2xl md:text-3xl font-semibold leading-snug',
  4: 'text-xl md:text-2xl font-medium leading-snug',
};

export function Heading({ level, children, className, as }: HeadingProps) {
  const Component = as || (`h${level}` as 'h1' | 'h2' | 'h3' | 'h4');
  
  return (
    <Component className={cn(headingStyles[level], 'text-gray-900 dark:text-slate-100', className)}>
      {children}
    </Component>
  );
}

interface TextProps {
  variant?: 'body' | 'muted' | 'caption' | 'emphasis' | 'small';
  children: React.ReactNode;
  className?: string;
  as?: 'p' | 'span' | 'div' | 'label';
}

const textStyles = {
  body: 'text-base leading-relaxed text-gray-900 dark:text-slate-100',
  muted: 'text-sm leading-relaxed text-gray-600 dark:text-slate-400',
  caption: 'text-xs leading-normal text-gray-500 dark:text-slate-500',
  emphasis: 'text-base leading-relaxed font-semibold text-gray-900 dark:text-slate-100',
  small: 'text-sm leading-normal text-gray-700 dark:text-slate-300',
};

export function Text({ variant = 'body', children, className, as = 'p' }: TextProps) {
  const Component = as;
  
  return (
    <Component className={cn(textStyles[variant], className)}>
      {children}
    </Component>
  );
}
