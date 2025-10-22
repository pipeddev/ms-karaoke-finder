import { BaseDTO } from './base.dto';

export class JSendDTO<T> extends BaseDTO {
  readonly status: 'success' | 'fail' | 'error';
  readonly data?: T;
  readonly message?: string;

  private constructor() {
    super();
  }

  static success<T>(data: T): JSendDTO<T> {
    return {
      status: 'success',
      data,
    };
  }

  static fail<T>(error: T): JSendDTO<T> {
    return {
      status: 'fail',
      data: error,
    };
  }

  static error(message: string): JSendDTO<string> {
    return {
      status: 'error',
      message: `Consulte a soporte por error: ${message}`,
    };
  }
}
