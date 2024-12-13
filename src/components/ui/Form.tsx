import React from 'react';
import {
  BaseFormProps,
  BaseFormFieldProps,
  BaseFormInputProps,
  BaseFormTextAreaProps,
  BaseFormSelectProps
} from '@types/ui';
import { theme, variants } from '@constants/theme';

export function BaseForm({
  children,
  darkMode,
  spacing = 'md',
  padding = true,
  className = '',
  ...props
}: BaseFormProps) {
  const baseClasses = `
    ${padding ? 'p-4' : ''}
    ${spacing === 'sm' ? 'space-y-2' : spacing === 'lg' ? 'space-y-6' : 'space-y-4'}
    ${className}
  `;

  return (
    <form className={baseClasses} {...props}>
      {children}
    </form>
  );
}

export function BaseFormField({
  children,
  label,
  error,
  darkMode
}: BaseFormFieldProps) {
  const mode = darkMode ? 'dark' : 'light';
  const themeMode = theme[mode];

  return (
    <div>
      {label && (
        <label className={`block text-sm font-medium mb-1 ${themeMode.text.secondary}`}>
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className={`mt-1 text-sm ${error ? 'text-red-500' : themeMode.text.tertiary}`}>
          {error}
        </p>
      )}
    </div>
  );
}

export function BaseFormInput({
  darkMode,
  className = '',
  ...props
}: BaseFormInputProps) {
  const variantClasses = variants.input[props['aria-invalid'] ? 'error' : 'default'][darkMode ? 'dark' : 'light'];
  
  const baseClasses = `
    w-full rounded-lg px-3 py-2
    ${variantClasses}
    shadow-sm focus:ring-blue-500 focus:border-blue-500
    ${className}
  `;

  return <input className={baseClasses} {...props} />;
}

export function BaseFormTextArea({
  darkMode,
  className = '',
  ...props
}: BaseFormTextAreaProps) {
  const variantClasses = variants.input[props['aria-invalid'] ? 'error' : 'default'][darkMode ? 'dark' : 'light'];
  
  const baseClasses = `
    w-full rounded-lg px-3 py-2
    ${variantClasses}
    shadow-sm focus:ring-blue-500 focus:border-blue-500
    ${className}
  `;

  return <textarea className={baseClasses} {...props} />;
}

export function BaseFormSelect({
  darkMode,
  className = '',
  ...props
}: BaseFormSelectProps) {
  const variantClasses = variants.input[props['aria-invalid'] ? 'error' : 'default'][darkMode ? 'dark' : 'light'];
  
  const baseClasses = `
    w-full rounded-lg px-3 py-2
    ${variantClasses}
    shadow-sm focus:ring-blue-500 focus:border-blue-500
    ${className}
  `;

  return <select className={baseClasses} {...props} />;
} 