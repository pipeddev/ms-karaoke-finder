import { v4 } from 'uuid';
import { LoggerHelper } from '../logger/logger';

export class GlobalExceptionError extends Error {
  readonly id: string;

  constructor(
    readonly logger: LoggerHelper,
    readonly prefix: string,
    readonly error: Error,
  ) {
    super();
    this.name = error.name;
    this.stack = error.stack;
    this.id = v4();
    this.message = `[${this.id}] ${error.message}`;
  }
}
