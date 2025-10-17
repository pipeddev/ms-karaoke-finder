export interface JSendSuccess<T = unknown> {
  status: 'success';
  data: T;
}

export interface JSendFail {
  status: 'fail';
  data: Record<string, unknown>;
}

export interface JSendError {
  status: 'error';
  message: string;
  code?: number;
  data?: Record<string, unknown>;
}

export type JSendResponse<T = unknown> =
  | JSendSuccess<T>
  | JSendFail
  | JSendError;
