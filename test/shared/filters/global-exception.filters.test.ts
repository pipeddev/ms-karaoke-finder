import { ArgumentsHost } from '@nestjs/common';
import { GlobalExceptionFilter } from '../../../src/shared/filters/global-exception.filters';
import { GlobalExceptionError } from '../../../src/shared/error/global-exception.error';
import { BusinessError } from '../../../src/shared/error/business.error';
import { HttpReplyLike } from '../../../src/shared/http/http-reply-like.interface';
import { JSendDTO } from 'src/shared/dtos/jsend.dto';
import { LoggerHelper } from 'src/shared/logger/logger';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let mockResponse: jest.Mocked<HttpReplyLike>;
  let mockHost: jest.Mocked<ArgumentsHost>;
  let mockLogger: jest.Mocked<LoggerHelper>;

  beforeAll(() => {
    filter = new GlobalExceptionFilter();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as unknown as jest.Mocked<HttpReplyLike>;

    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
    } as unknown as jest.Mocked<ArgumentsHost>;

    mockLogger = {
      logError: jest.fn(),
    } as unknown as jest.Mocked<LoggerHelper>;
  });

  describe('when exception is BusinessError', () => {
    it('should return fail response with business error status', () => {
      const businessError = new BusinessError('Business error message', 400);
      const expectedBody = JSendDTO.fail(businessError);

      filter.catch(businessError, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith(expectedBody);
    });
  });

  describe('when exception is GlobalExceptionError with BusinessError', () => {
    it('should log error and return fail response', () => {
      const businessError = new BusinessError('Business error', 422);
      const globalException = new GlobalExceptionError(
        mockLogger,
        'prefix',
        businessError,
      );

      const expectedBody = JSendDTO.fail(businessError);

      filter.catch(globalException, mockHost);

      expect(mockLogger.logError).toHaveBeenCalledWith('prefix', businessError);
      expect(mockResponse.status).toHaveBeenCalledWith(422);
      expect(mockResponse.send).toHaveBeenCalledWith(expectedBody);
    });
  });

  describe('when exception is GlobalExceptionError with generic Error', () => {
    it('should log error and return 500 error response', () => {
      const genericError = new Error('Generic error');
      const globalException = new GlobalExceptionError(
        mockLogger,
        'prefix',
        genericError,
      );

      filter.catch(globalException, mockHost);

      expect(mockLogger.logError).toHaveBeenCalledWith('prefix', genericError);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });
});
