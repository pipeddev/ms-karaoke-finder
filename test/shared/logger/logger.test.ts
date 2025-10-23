import { Logger } from '@nestjs/common';
import { LoggerHelper } from 'src/shared/logger/logger';
import { BusinessError } from 'src/shared/error/business.error';
import { ToStringUtils } from 'src/shared/utils/to-string.util';

jest.mock('@nestjs/common');
jest.mock('src/shared/utils/to-string.util');

describe('LoggerHelper', () => {
  let loggerHelper: LoggerHelper;
  let mockLogger: jest.Mocked<Logger>;

  beforeAll(() => {
    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<Logger>;

    (Logger as jest.MockedClass<typeof Logger>).mockImplementation(
      () => mockLogger,
    );

    loggerHelper = new LoggerHelper('TestLogger');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create logger with provided name', () => {
      expect(Logger).toHaveBeenCalledWith('TestLogger');
    });
  });

  describe('logBegin', () => {
    it('should log begin message with prefix and message', () => {
      loggerHelper.logBegin('TEST', 'test message');
      expect(mockLogger.log).toHaveBeenCalledWith('TEST - Begin: test message');
    });

    it('should log begin message with prefix only', () => {
      loggerHelper.logBegin('TEST');
      expect(mockLogger.log).toHaveBeenCalledWith('TEST - Begin: ');
    });
  });

  describe('logEnd', () => {
    it('should log end message with prefix and message', () => {
      loggerHelper.logEnd('TEST', 'test message');
      expect(mockLogger.log).toHaveBeenCalledWith('TEST - End: test message');
    });

    it('should log end message with prefix only', () => {
      loggerHelper.logEnd('TEST');
      expect(mockLogger.log).toHaveBeenCalledWith('TEST - End: ');
    });
  });

  describe('debugBegin', () => {
    it('should debug begin message with prefix and message', () => {
      loggerHelper.debugBegin('TEST', 'test message');
      expect(mockLogger.debug).toHaveBeenCalledWith(
        'TEST - Begin: test message',
      );
    });

    it('should debug begin message with prefix only', () => {
      loggerHelper.debugBegin('TEST');
      expect(mockLogger.debug).toHaveBeenCalledWith('TEST - Begin: ');
    });
  });

  describe('debugEnd', () => {
    it('should debug end message with prefix and message', () => {
      loggerHelper.debugEnd('TEST', 'test message');
      expect(mockLogger.debug).toHaveBeenCalledWith('TEST - End: test message');
    });

    it('should debug end message with prefix only', () => {
      loggerHelper.debugEnd('TEST');
      expect(mockLogger.debug).toHaveBeenCalledWith('TEST - End: ');
    });
  });

  describe('logError', () => {
    it('should log BusinessError with ToStringUtils', () => {
      const businessError = new BusinessError({
        field1: 'error1',
        field2: 'error2',
      });
      (ToStringUtils.toString as jest.Mock).mockReturnValue('error1, error2');

      loggerHelper.logError('TEST', businessError);

      expect(ToStringUtils.toString).toHaveBeenCalledWith({
        field1: 'error1',
        field2: 'error2',
      });
      expect(mockLogger.error).toHaveBeenCalledWith(
        'TEST - Error: error1, error2',
      );
    });

    it('should log generic Error with stack trace', () => {
      const error = new Error('Generic error');
      error.stack = 'stack trace';

      loggerHelper.logError('TEST', error);

      expect(mockLogger.error).toHaveBeenCalledWith(
        'TEST: Error - Generic error - stack trace',
      );
    });
  });

  describe('debugError', () => {
    it('should debug BusinessError with ToStringUtils', () => {
      const businessError = new BusinessError({
        field1: 'error1',
        field2: 'error2',
      });
      (ToStringUtils.toString as jest.Mock).mockReturnValue('error1, error2');

      loggerHelper.debugError('TEST', businessError);

      expect(ToStringUtils.toString).toHaveBeenCalledWith({
        field1: 'error1',
        field2: 'error2',
      });
      expect(mockLogger.error).toHaveBeenCalledWith(
        'TEST - Error: error1, error2',
      );
    });

    it('should debug generic Error with stack trace', () => {
      const error = new Error('Generic error');
      error.stack = 'stack trace';

      loggerHelper.debugError('TEST', error);

      expect(mockLogger.error).toHaveBeenCalledWith(
        'TEST: Error - Generic error - stack trace',
      );
    });
  });
});
