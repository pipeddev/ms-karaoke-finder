import { HttpStatus } from '@nestjs/common';

export type MessageErrorMap = Record<string, string>;
export type MessagesError = string | MessageErrorMap | Error;

export class BusinessError extends Error {
  readonly messages: MessageErrorMap;
  readonly statusCode: HttpStatus = HttpStatus.BAD_REQUEST;
  readonly error: Error;

  constructor(
    messages: MessagesError,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super();
    this.statusCode = statusCode;
    this.name = 'BusinessError';

    if (messages instanceof Error) {
      this.error = messages;
      this.messages = { message: messages.message };
    } else if (typeof messages === 'string') {
      this.messages = { error: messages };
    } else {
      this.messages = messages;
    }
  }
}
