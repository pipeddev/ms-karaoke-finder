import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { GlobalExceptionError } from '../error/global-exception.error';
import { HttpReplyLike } from '../http/http-reply-like.interface';
import { BusinessError } from '../error/business.error';
import { JSendDTO } from '../jsend/jsend';

@Catch(GlobalExceptionError, BusinessError)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: GlobalExceptionError | BusinessError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<HttpReplyLike>();

    // Si es BusinessError directamente
    if (exception instanceof BusinessError) {
      const status = exception.statusCode;
      const body = JSendDTO.fail(exception);
      response.status(status).send(body);
      return;
    }

    // Si es GlobalExceptionError
    const error = exception.error as BusinessError | Error;
    if (error instanceof BusinessError) {
      const status = error.statusCode;
      const body = JSendDTO.fail(error);

      exception.logger.logError(exception.prefix, error);
      response.status(status).send(body);
    } else {
      const status = 500;
      const body = JSendDTO.error(
        `Error interno ${exception.id}: ${error.message}`,
      );

      exception.logger.logError(exception.prefix, error);
      response.status(status).send(body);
    }
  }
}
