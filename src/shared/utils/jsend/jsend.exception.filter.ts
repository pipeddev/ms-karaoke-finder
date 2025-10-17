import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  ContextType,
} from '@nestjs/common';
import { JSendError, JSendFail } from './jsend-response';
import { JSend } from './jsend';

interface FastifyResponse {
  status(code: number): FastifyResponse;
  send(payload: unknown): FastifyResponse;
}

@Catch()
export class JSendExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(JSendExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    // Permite que GraphQL maneje sus propias excepciones
    if ((host.getType<ContextType>() as string) === 'graphql') {
      throw exception;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyResponse>();

    let status: number;
    let jsendResponse: JSendError | JSendFail;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (status >= 400 && status < 500) {
        // Errores de cliente - respuesta 'fail'
        jsendResponse = {
          status: 'fail',
          data:
            typeof exceptionResponse === 'string'
              ? { message: exceptionResponse }
              : (exceptionResponse as Record<string, unknown>),
        };
      } else {
        // Errores de servidor - respuesta 'error'
        jsendResponse = JSend.error(
          exception.message || 'Internal Server Error',
          undefined,
          { statusCode: status },
        );
      }
    } else {
      // Errores desconocidos - usar estado 'error' de JSend
      status = HttpStatus.INTERNAL_SERVER_ERROR;

      const errorMessage =
        exception instanceof Error
          ? exception.message
          : 'Internal server error';
      const errorData =
        exception instanceof Error ? { message: exception.message } : undefined;
      jsendResponse = JSend.error(errorMessage, status, errorData);

      // Registrar errores inesperados con más detalle
      this.logger.error('Ocurrió un error inesperado:', {
        message: errorMessage,
        stack:
          exception instanceof Error
            ? exception.stack
            : 'No hay stack trace disponible',
        exception,
      });
    }

    response.status(status).send(jsendResponse);
  }
}
