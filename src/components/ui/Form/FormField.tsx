import React from 'react';

interface FormFieldProps {
  children: React.ReactNode;
  label?: string;
  error?: string;
  required?: boolean;
  darkMode: boolean;
}

export function FormField({
  children,
  label,
  error,
  required = false,
  darkMode
}: FormFieldProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="flex items-center space-x-1">
          <span>{label}</span>
          {required && (
            <span className="text-red-400 text-sm">*</span>
          )}
        </label>
      )}
      {children}
      {error && (
        <p className="form-error">{error}</p>
      )}
    </div>
  );
} 