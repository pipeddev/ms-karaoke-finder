import { ArgumentMetadata } from '@nestjs/common';
import { TransformPlainToInstancePipe } from 'src/shared/pipes/transform-plain-to-instance.pipe';
import { LoggerHelper } from 'src/shared/logger/logger';
import { GlobalExceptionError } from 'src/shared/error/global-exception.error';
import * as classTransformer from 'class-transformer';

jest.mock('src/shared/logger/logger');
jest.mock('src/shared/error/global-exception.error');

class TestDto {
  name: string;
  age: number;
}

describe('TransformPlainToInstancePipe', () => {
  let pipe: TransformPlainToInstancePipe;

  beforeEach(() => {
    pipe = new TransformPlainToInstancePipe();
    jest.clearAllMocks();
  });

  describe('transform', () => {
    it('should return value when metatype is undefined', () => {
      const value = { name: 'test' };
      const metadata: ArgumentMetadata = {
        metatype: undefined,
        type: 'body',
      };

      const result = pipe.transform(value, metadata);

      expect(result).toBe(value);
    });

    it('should return value when metatype is not a function', () => {
      const value = { name: 'test' };
      const metadata: ArgumentMetadata = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        metatype: 'string' as any,
        type: 'body',
      };

      const result = pipe.transform(value, metadata);

      expect(result).toBe(value);
    });

    it('should return value when metatype is not a constructor', () => {
      const value = { name: 'test' };
      const notAConstructor = () => {};
      delete notAConstructor.prototype;
      const metadata: ArgumentMetadata = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        metatype: notAConstructor as any,
        type: 'body',
      };

      const result = pipe.transform(value, metadata);

      expect(result).toBe(value);
    });

    it('should transform plain object to class instance', () => {
      const value = { name: 'John', age: 30 };
      const metadata: ArgumentMetadata = {
        metatype: TestDto,
        type: 'body',
      };
      const expectedInstance = new TestDto();
      expectedInstance.name = 'John';
      expectedInstance.age = 30;

      jest
        .spyOn(classTransformer, 'plainToInstance')
        .mockReturnValue(expectedInstance);

      const result = pipe.transform(value, metadata);

      expect(classTransformer.plainToInstance).toHaveBeenCalledWith(
        TestDto,
        value,
      );
      expect(result).toBe(expectedInstance);
    });

    it('should throw GlobalExceptionError when plainToInstance throws', () => {
      const value = { name: 'test' };
      const metadata: ArgumentMetadata = {
        metatype: TestDto,
        type: 'body',
      };
      const error = new Error('Transform error');

      jest.spyOn(classTransformer, 'plainToInstance').mockImplementation(() => {
        throw error;
      });

      expect(() => pipe.transform(value, metadata)).toThrow(
        GlobalExceptionError,
      );
      expect(GlobalExceptionError).toHaveBeenCalledWith(
        expect.any(LoggerHelper),
        'transform',
        error,
      );
    });
  });

  describe('isConstructor', () => {
    it('should return true for valid constructor', () => {
      const result = pipe['isConstructor'](TestDto);

      expect(result).toBe(true);
    });

    it('should return false for non-function', () => {
      const result = pipe['isConstructor']('string');

      expect(result).toBe(false);
    });

    it('should return false for function without prototype', () => {
      const func = () => {};
      delete func.prototype;

      const result = pipe['isConstructor'](func);

      expect(result).toBe(false);
    });
  });
});
