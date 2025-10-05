/**
 * Design system theme configuration
 * Central source of truth for colors, typography, spacing, and other design tokens
 */

export const theme = {
  colors: {
    light: {
      // Primary brand colors
      primary: '#0ea5e9', // sky-500
      primaryHover: '#0284c7', // sky-600
      primaryActive: '#0369a1', // sky-700
      
      // Secondary colors
      secondary: '#6366f1', // indigo-500
      secondaryHover: '#4f46e5', // indigo-600
      
      // Accent colors
      accent: '#8b5cf6', // violet-500
      accentHover: '#7c3aed', // violet-600
      
      // Background colors
      background: '#ffffff',
      backgroundAlt: '#f9fafb', // gray-50
      
      // Surface colors (cards, panels)
      surface: '#ffffff',
      surfaceHover: '#f9fafb',
      
      // Border colors
      border: '#e5e7eb', // gray-200
      borderHover: '#d1d5db', // gray-300
      
      // Text colors
      text: '#111827', // gray-900
      textSecondary: '#4b5563', // gray-600
      textMuted: '#6b7280', // gray-500
      textDisabled: '#9ca3af', // gray-400
      
      // Semantic colors
      success: '#10b981', // green-500
      successBg: '#d1fae5', // green-100
      successBorder: '#6ee7b7', // green-300
      
      warning: '#f59e0b', // amber-500
      warningBg: '#fef3c7', // amber-100
      warningBorder: '#fcd34d', // amber-300
      
      error: '#ef4444', // red-500
      errorBg: '#fee2e2', // red-100
      errorBorder: '#fca5a5', // red-300
      
      info: '#3b82f6', // blue-500
      infoBg: '#dbeafe', // blue-100
      infoBorder: '#93c5fd', // blue-300
    },
    dark: {
      // Primary brand colors
      primary: '#38bdf8', // sky-400
      primaryHover: '#0ea5e9', // sky-500
      primaryActive: '#0284c7', // sky-600
      
      // Secondary colors
      secondary: '#818cf8', // indigo-400
      secondaryHover: '#6366f1', // indigo-500
      
      // Accent colors
      accent: '#a78bfa', // violet-400
      accentHover: '#8b5cf6', // violet-500
      
      // Background colors
      background: '#0f172a', // slate-900
      backgroundAlt: '#1e293b', // slate-800
      
      // Surface colors (cards, panels)
      surface: '#1e293b', // slate-800
      surfaceHover: '#334155', // slate-700
      
      // Border colors
      border: '#334155', // slate-700
      borderHover: '#475569', // slate-600
      
      // Text colors
      text: '#f1f5f9', // slate-100
      textSecondary: '#cbd5e1', // slate-300
      textMuted: '#94a3b8', // slate-400
      textDisabled: '#64748b', // slate-500
      
      // Semantic colors
      success: '#22c55e', // green-500
      successBg: '#14532d', // green-900
      successBorder: '#166534', // green-800
      
      warning: '#fbbf24', // amber-400
      warningBg: '#78350f', // amber-900
      warningBorder: '#92400e', // amber-800
      
      error: '#f87171', // red-400
      errorBg: '#7f1d1d', // red-900
      errorBorder: '#991b1b', // red-800
      
      info: '#60a5fa', // blue-400
      infoBg: '#1e3a8a', // blue-900
      infoBorder: '#1e40af', // blue-800
    },
  },
  
  spacing: {
    xs: '0.5rem', // 8px
    sm: '0.75rem', // 12px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    '2xl': '3rem', // 48px
    '3xl': '4rem', // 64px
  },
  
  radius: {
    none: '0',
    sm: '0.25rem', // 4px
    md: '0.5rem', // 8px
    lg: '0.75rem', // 12px
    xl: '1rem', // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    },
    fontSize: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem', // 48px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  
  transitions: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export type Theme = typeof theme;
export type ColorMode = 'light' | 'dark';
