import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names with Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a file size in bytes to a human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Debounces a function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Copies text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text:', err);
    return false;
  }
}

/**
 * Validates a YAML string
 */
export function validateYAML(content: string): {
  isValid: boolean;
  error?: string;
} {
  try {
    const yaml = require('yaml');
    yaml.parse(content);
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: (error as Error).message,
    };
  }
}

/**
 * Formats a date to a human-readable string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Generates a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Checks if a string is a valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extracts file extension from a filename
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

/**
 * Checks if a file is a YAML file
 */
export function isYAMLFile(filename: string): boolean {
  const ext = getFileExtension(filename).toLowerCase();
  return ext === 'yml' || ext === 'yaml';
}

/**
 * Formats a YAML string
 */
export function formatYAML(content: string): string {
  try {
    const yaml = require('yaml');
    const parsed = yaml.parse(content);
    return yaml.stringify(parsed, { indent: 2 });
  } catch {
    return content;
  }
}

/**
 * Converts YAML to JSON
 */
export function yamlToJSON(content: string): string {
  try {
    const yaml = require('yaml');
    const parsed = yaml.parse(content);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return '';
  }
}

/**
 * Converts JSON to YAML
 */
export function jsonToYAML(content: string): string {
  try {
    const yaml = require('yaml');
    const parsed = JSON.parse(content);
    return yaml.stringify(parsed, { indent: 2 });
  } catch {
    return '';
  }
}

/**
 * Checks if a string is valid JSON
 */
export function isValidJSON(content: string): boolean {
  try {
    JSON.parse(content);
    return true;
  } catch {
    return false;
  }
}

/**
 * Creates a throttled function that only invokes func at most once per wait period
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  let lastResult: ReturnType<T>;
  return function throttled(...args: Parameters<T>): void {
    if (!inThrottle) {
      lastResult = func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), wait);
    }
  };
}

/**
 * Downloads content as a file
 */
export function downloadFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Reads a file as text
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/**
 * Checks if the current environment is development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Checks if the current environment is production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Checks if the current environment is test
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}

/**
 * Gets the current environment
 */
export function getEnvironment(): string {
  return process.env.NODE_ENV || 'development';
}

/**
 * Checks if running in browser
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Checks if running in node
 */
export function isNode(): boolean {
  return typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
}

/**
 * Gets the current platform (browser, node, etc)
 */
export function getPlatform(): string {
  if (isBrowser()) return 'browser';
  if (isNode()) return 'node';
  return 'unknown';
}

/**
 * Safely access nested object properties
 */
export function get(obj: any, path: string, defaultValue: any = undefined): any {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  return result === undefined || result === obj ? defaultValue : result;
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  if (obj instanceof Object) {
    const copy = {} as any;
    Object.keys(obj).forEach(key => {
      copy[key] = deepClone((obj as any)[key]);
    });
    return copy;
  }
  throw new Error(`Unable to copy obj! Its type isn't supported.`);
}

/**
 * Deep compare two objects
 */
export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  if (obj1 == null || obj2 == null) return false;
  if (obj1.constructor !== obj2.constructor) return false;
  
  if (obj1 instanceof Function) return obj1 === obj2;
  if (obj1 instanceof RegExp) return obj1 === obj2;
  if (obj1 === obj2 || obj1.valueOf() === obj2.valueOf()) return true;
  if (Array.isArray(obj1) && obj1.length !== obj2.length) return false;

  if (obj1 instanceof Date) return false;
  if (!(obj1 instanceof Object)) return false;
  if (!(obj2 instanceof Object)) return false;

  const p = Object.keys(obj1);
  return (
    Object.keys(obj2).every(i => p.indexOf(i) !== -1) &&
    p.every(i => deepEqual(obj1[i], obj2[i]))
  );
} 