import { JSendSuccess, JSendFail, JSendError } from './jsend-response';

export class JSend {
  /**
   * Crea una respuesta JSend exitosa
   * @param data Los datos a devolver
   * @returns Respuesta JSend con estado 'success'
   */
  static success<T>(data: T): JSendSuccess<T> {
    return {
      status: 'success',
      data,
    };
  }

  /**
   * Crea una respuesta JSend de fallo (errores de cliente)
   * @param data Objeto con información sobre el fallo
   * @returns Respuesta JSend con estado 'fail'
   */
  static fail(data: Record<string, unknown>): JSendFail {
    return {
      status: 'fail',
      data,
    };
  }

  /**
   * Crea una respuesta JSend de error (errores de servidor)
   * @param message Mensaje de error
   * @param code Código de error opcional
   * @param data Datos adicionales opcionales
   * @returns Respuesta JSend con estado 'error'
   */
  static error(
    message: string,
    code?: number,
    data?: Record<string, unknown>,
  ): JSendError {
    return {
      status: 'error',
      message,
      ...(code !== undefined && { code }),
      ...(data !== undefined && { data }),
    };
  }
}
