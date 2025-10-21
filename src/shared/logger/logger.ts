import { Logger } from '@nestjs/common';
import { BusinessError } from '../error/business.error';
import { ToStringUtils } from '../utils/to-string.util';

export class LoggerHelper {
  private logger: Logger;

  constructor(loggerName: string) {
    this.logger = new Logger(loggerName);
  }

  logBegin(prefix: string, message: string = '') {
    this.logger.log(`${prefix} - Begin: ${message}`);
  }

  logEnd(prefix: string, message: string = '') {
    this.logger.log(`${prefix} - End: ${message}`);
  }

  debugBegin(prefix: string, message: string = '') {
    this.logger.debug(`${prefix} - Begin: ${message}`);
  }

  debugEnd(prefix: string, message: string = '') {
    this.logger.debug(`${prefix} - End: ${message}`);
  }

  logError(prefix: string, error: Error) {
    if (error instanceof BusinessError) {
      const message = ToStringUtils.toString(error.messages);
      this.logger.error(`${prefix} - Error: ${message}`);
    } else {
      this.logException(prefix, error);
    }
  }

  debugError(prefix: string, error: Error) {
    if (error instanceof BusinessError) {
      const message = ToStringUtils.toString(error.messages);
      this.logger.error(`${prefix} - Error: ${message}`);
    } else {
      this.logException(prefix, error);
    }
  }

  private logException(prefix: string, error: Error) {
    this.logger.error(
      `${prefix}: ${error.name} - ${error.message} - ${error.stack}`,
    );
  }
}
