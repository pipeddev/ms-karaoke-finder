import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance, ClassConstructor } from 'class-transformer';
import { LoggerHelper } from '../logger/logger';
import { GlobalExceptionError } from '../error/global-exception.error';

@Injectable()
export class TransformPlainToInstancePipe implements PipeTransform<unknown> {
  private logger: LoggerHelper = new LoggerHelper(
    TransformPlainToInstancePipe.name,
  );

  transform<T = unknown>(
    value: unknown,
    { metatype }: ArgumentMetadata,
  ): unknown {
    try {
      if (!metatype || typeof metatype !== 'function') return value;

      // Type guard to verify that metatype is a constructor
      if (!this.isConstructor<T>(metatype)) return value;

      const object = plainToInstance<T, unknown>(metatype, value as object);
      return object;
    } catch (error) {
      throw new GlobalExceptionError(this.logger, 'transform', error as Error);
    }
  }

  private isConstructor<T>(value: unknown): value is ClassConstructor<T> {
    return typeof value === 'function' && value.prototype !== undefined;
  }
}
