export type ValidationSeverity = 'error' | 'warning' | 'info' | 'hint';

export interface ValidationMessage {
  id: string;
  type: ValidationSeverity;
  message: string;
  line?: number;
  column?: number;
  endLine?: number;
  endColumn?: number;
  source?: string;
}

export interface ValidationResult {
  messages: ValidationMessage[];
  valid: boolean;
}

export interface ValidationOptions {
  customRules?: boolean;
  standardRules?: boolean;
  severity?: "error" | "warning" | "info";
  includeSource?: boolean;
  includeSuggestions?: boolean;
}

declare global {
  interface Window {
    applyAiFix: (messageId: string) => Promise<void>;
    dismissAiFix: () => void;
  }
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

export interface Environment {
  id: string;
  name: string;
  variables: Record<string, string>;
  isDefault?: boolean;
} 