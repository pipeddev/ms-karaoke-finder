import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { JSend } from './jsend';
import { JSendResponse } from './jsend-response';

interface FastifyReply {
  header(name: string, value: string): FastifyReply;
  getHeader(name: string): string | string[] | undefined;
}

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

    const reply = context.switchToHttp().getResponse<FastifyReply>();

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

        if (reply?.header && reply?.getHeader) {
          const existingContentType = reply.getHeader('content-type');
          if (!existingContentType) {
            reply.header('Content-Type', 'application/json; charset=utf-8');
          }
        }

        return JSend.success(data);
      }),
    );
  }
}
