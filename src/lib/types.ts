export interface ValidationMessage {
  id: string;
  type: 'error' | 'warning';
  message: string;
  path?: string;
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