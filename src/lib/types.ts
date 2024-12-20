export interface ValidationMessage {
  id: string;
  type: "error" | "warning" | "info";
  message: string;
  path?: string;
  line?: number;
  column?: number;
  source?: string;
  suggestions?: string[];
  context?: {
    schemaName?: string;
    path?: string;
    method?: string;
    [key: string]: any;
  };
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