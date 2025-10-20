export interface JSendSuccessResponse<T> {
  status: 'success';
  data: T;
}

export interface JSendFailResponse<E> {
  status: 'fail';
  data: E;
}

export interface JSendErrorResponse<D = any> {
  status: 'error';
  message: string;
  data?: D;
}

export type JSendResponse<T = any, E = any, D = any> =
  | JSendSuccessResponse<T>
  | JSendFailResponse<E>
  | JSendErrorResponse<D>;

export class JSendDTO {
  static success<T = any>(data: T = {} as T): JSendSuccessResponse<T> {
    return {
      status: 'success',
      data,
    };
  }

  static fail<E = any>(data: E): JSendFailResponse<E> {
    return {
      status: 'fail',
      data,
    };
  }

  static error<D = any>(message: string, data?: D): JSendErrorResponse<D> {
    const response: JSendErrorResponse<D> = {
      status: 'error',
      message,
    };

    if (data !== undefined) {
      response.data = data;
    }

    return response;
  }
}
