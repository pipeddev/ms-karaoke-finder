import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { JSend } from './jsend';
import { JSendResponse } from './jsend-response';
import { HttpReplyLike } from '../http/http-reply-like.interface';

@Injectable()
export class JSendInterceptor<T>
  implements NestInterceptor<T, JSendResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<JSendResponse<T>> {
    // Guard: Skip non-HTTP contexts (GraphQL, WebSocket, etc.)
    if (context.getType() !== 'http') {
      return next.handle() as Observable<JSendResponse<T>>;
    }

    const reply = context.switchToHttp().getResponse<HttpReplyLike>();

    return next.handle().pipe(
      map((data: T) => {
        if (
          typeof data === 'object' &&
          data !== null &&
          'status' in data &&
          ['success', 'fail', 'error'].includes(
            String((data as { status?: unknown })?.status),
          )
        ) {
          return data as unknown as JSendResponse<T>;
        }

        // Feature detection for setting headers
        if (this.canSetHeaders(reply)) {
          const existingContentType = reply.getHeader('content-type');
          if (!existingContentType) {
            reply.header('Content-Type', 'application/json; charset=utf-8');
          }
        }

        // Handle special status codes
        if (this.canSetStatusCode(reply)) {
          const statusCode = reply.statusCode;
          if (statusCode === 204 || statusCode === 304) {
            // Don't wrap 204 No Content or 304 Not Modified responses
            return data as unknown as JSendResponse<T>;
          }
        }

        return JSend.success(data);
      }),
    );
  }

  private canSetHeaders(reply: unknown): reply is HttpReplyLike {
    return (
      typeof reply === 'object' &&
      reply !== null &&
      'header' in reply &&
      'getHeader' in reply &&
      typeof (reply as { header?: unknown }).header === 'function' &&
      typeof (reply as { getHeader?: unknown }).getHeader === 'function'
    );
  }

  private canSetStatusCode(reply: unknown): reply is HttpReplyLike {
    return (
      typeof reply === 'object' &&
      reply !== null &&
      'statusCode' in reply &&
      typeof (reply as { statusCode?: unknown }).statusCode === 'number'
    );
  }
}
