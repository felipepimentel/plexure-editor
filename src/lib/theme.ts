import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export type Theme = 'light' | 'dark' | 'system'

export const themes = {
  light: {
    background: 'bg-white',
    foreground: 'text-gray-900',
    muted: 'text-gray-500',
    border: 'border-gray-200',
    accent: 'bg-blue-500 text-white',
    hover: 'hover:bg-gray-100',
    focus: 'focus:ring-2 focus:ring-blue-500',
    active: 'active:bg-gray-200',
    selected: 'bg-blue-50',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    success: 'text-green-500',
    info: 'text-blue-500',
  },
  dark: {
    background: 'bg-gray-900',
    foreground: 'text-gray-50',
    muted: 'text-gray-400',
    border: 'border-gray-800',
    accent: 'bg-blue-500 text-white',
    hover: 'hover:bg-gray-800',
    focus: 'focus:ring-2 focus:ring-blue-500',
    active: 'active:bg-gray-700',
    selected: 'bg-gray-800',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    success: 'text-green-400',
    info: 'text-blue-400',
  },
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const transitions = {
  fast: 'transition-all duration-150 ease-in-out',
  normal: 'transition-all duration-200 ease-in-out',
  slow: 'transition-all duration-300 ease-in-out',
}

export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
}

export const rounded = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
}

export const spacing = {
  0: '0px',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
  40: '10rem',
  48: '12rem',
  56: '14rem',
  64: '16rem',
}

export const typography = {
  h1: 'text-4xl font-bold tracking-tight',
  h2: 'text-3xl font-semibold tracking-tight',
  h3: 'text-2xl font-semibold tracking-tight',
  h4: 'text-xl font-semibold tracking-tight',
  p: 'text-base leading-7',
  small: 'text-sm leading-6',
  tiny: 'text-xs leading-5',
  mono: 'font-mono',
} 