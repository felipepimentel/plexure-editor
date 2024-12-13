import { ReactNode } from 'react';

// Card Types
export interface BaseCardProps {
  title: string | ReactNode;
  subtitle?: string;
  icon?: ReactNode;
  isSelected?: boolean;
  isExpandable?: boolean;
  darkMode: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  children?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

// List Types
export interface BaseListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  loading?: boolean;
  error?: string;
  darkMode: boolean;
  layout?: 'grid' | 'list';
  className?: string;
  itemClassName?: string;
}

// Button Types
export interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  darkMode: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
}

// Form Types
export interface BaseFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  darkMode: boolean;
  spacing?: 'sm' | 'md' | 'lg';
  padding?: boolean;
}

export interface BaseFormFieldProps {
  children: ReactNode;
  label?: string;
  error?: string;
  darkMode: boolean;
}

export interface BaseFormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  darkMode: boolean;
}

export interface BaseFormTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  darkMode: boolean;
}

export interface BaseFormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  darkMode: boolean;
}

// Modal Types
export interface BaseModalProps {
  children: ReactNode;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export interface BaseModalActionsProps {
  children: ReactNode;
  darkMode: boolean;
  align?: 'left' | 'center' | 'right';
} 