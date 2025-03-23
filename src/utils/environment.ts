
/**
 * Utility functions to safely handle environment-specific code
 */

// Check if running in browser environment
export const isBrowser = typeof window !== 'undefined';

// Safe alternative to Node.js process.env
export const getEnv = (key: string): string | undefined => {
  if (isBrowser && (window as any).__ENV) {
    return (window as any).__ENV[key];
  }
  return undefined;
};

// Safe console logger that works in all environments
export const safeConsole = {
  log: (...args: any[]): void => {
    if (typeof console !== 'undefined') console.log(...args);
  },
  error: (...args: any[]): void => {
    if (typeof console !== 'undefined') console.error(...args);
  },
  warn: (...args: any[]): void => {
    if (typeof console !== 'undefined') console.warn(...args);
  },
  info: (...args: any[]): void => {
    if (typeof console !== 'undefined') console.info(...args);
  },
};
