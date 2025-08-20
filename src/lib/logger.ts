/**
 * Production-safe logging utility
 * Only logs in development or when explicitly enabled
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isDebugEnabled = process.env.NEXT_PUBLIC_DEBUG_LOGS === 'true';

  private shouldLog(level: LogLevel): boolean {
    // Always log errors
    if (level === 'error') return true;
    
    // Only log other levels in development or when debug is enabled
    return this.isDevelopment || this.isDebugEnabled;
  }

  info(...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.log(...args);
    }
  }

  warn(...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn(...args);
    }
  }

  error(...args: unknown[]): void {
    if (this.shouldLog('error')) {
      console.error(...args);
    }
  }

  debug(...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.log(...args);
    }
  }

  // Paddle-specific logging
  paddle = {
    info: (...args: unknown[]) => {
      if (this.shouldLog('debug')) {
        console.log('🏓', ...args);
      }
    },
    success: (...args: unknown[]) => {
      if (this.shouldLog('debug')) {
        console.log('✅', ...args);
      }
    },
    error: (...args: unknown[]) => {
      console.error('❌ Paddle Error:', ...args);
    },
    warn: (...args: unknown[]) => {
      if (this.shouldLog('warn')) {
        console.warn('⚠️ Paddle Warning:', ...args);
      }
    }
  };
}

export const logger = new Logger();
