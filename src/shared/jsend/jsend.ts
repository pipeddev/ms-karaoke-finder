/**
 * Interfaces para respuestas JSend con tipos genéricos
 */
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

/**
 * Utilidad para formatear respuestas según el estándar JSend
 * https://github.com/omniti-labs/jsend
 */
export class JSendDTO {
  /**
   * Formatea una respuesta exitosa
   * @param data - Los datos a incluir en la respuesta
   * @returns Objeto con formato JSend success
   */
  static success<T = any>(data: T = {} as T): JSendSuccessResponse<T> {
    return {
      status: 'success',
      data,
    };
  }

  /**
   * Formatea una respuesta de fallo (error del cliente)
   * @param data - Datos del error
   * @returns Objeto con formato JSend fail
   */
  static fail<E = any>(data: E): JSendFailResponse<E> {
    return {
      status: 'fail',
      data,
    };
  }

  /**
   * Formatea una respuesta de error (error del servidor)
   * @param message - Mensaje descriptivo del error
   * @param data - Datos adicionales opcionales
   * @returns Objeto con formato JSend error
   */
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
