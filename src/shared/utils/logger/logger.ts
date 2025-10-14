import { randomUUID } from 'crypto';
import { LoggerService, LogLevel } from '@nestjs/common';

export class AppLogger implements LoggerService {
  private readonly context?: string;
  private readonly logLevel: LogLevel[];

  constructor(context?: string) {
    this.context = context;
    this.logLevel = ['log', 'error', 'warn', 'debug'];
  }

  private format(level: string, message: any, trace?: string, uuid?: string) {
    const log = {
      timestamp: new Date().toISOString(),
      level,
      uuid: uuid ?? randomUUID(),
      context: this.context,
      message:
        typeof message === 'string'
          ? message
          : JSON.stringify(message, null, 2),
      ...(trace && { trace }),
    };

    console[level === 'error' ? 'error' : 'log'](JSON.stringify(log));
  }

  log(message: any, uuid?: string) {
    if (this.logLevel.includes('log'))
      this.format('info', message, undefined, uuid);
  }

  error(message: any, trace?: string, uuid?: string) {
    if (this.logLevel.includes('error'))
      this.format('error', message, trace, uuid);
  }

  warn(message: any, uuid?: string) {
    if (this.logLevel.includes('warn'))
      this.format('warn', message, undefined, uuid);
  }

  debug(message: any, uuid?: string) {
    if (this.logLevel.includes('debug'))
      this.format('debug', message, undefined, uuid);
  }
}
