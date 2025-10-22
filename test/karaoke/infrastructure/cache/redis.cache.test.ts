import { RedisCache } from 'src/karaoke/infrastructure/cache/redis.cache';
import { Redis } from '@upstash/redis';
import { LoggerHelper } from 'src/shared/logger/logger';

jest.mock('@upstash/redis');
jest.mock('src/shared/logger/logger');
jest.mock('src/shared/config/environment', () => ({
  Environment: {
    UPSTASH_REDIS_URL: 'mock-url',
    UPSTASH_REDIS_TOKEN: 'mock-token',
  },
}));

describe('RedisCache', () => {
  let redisCache: RedisCache;
  let mockRedisClient: jest.Mocked<Redis>;
  let mockLogger: jest.Mocked<LoggerHelper>;

  beforeAll(() => {
    jest.clearAllMocks();
    mockRedisClient = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    } as unknown as jest.Mocked<Redis>;
    (Redis as jest.MockedClass<typeof Redis>).mockImplementation(
      () => mockRedisClient,
    );
    mockLogger = {
      debugError: jest.fn(),
    } as unknown as jest.Mocked<LoggerHelper>;
    (LoggerHelper as jest.MockedClass<typeof LoggerHelper>).mockImplementation(
      () => mockLogger,
    );

    redisCache = new RedisCache();
  });

  describe('get', () => {
    it('should return value when key exists', async () => {
      mockRedisClient.get.mockResolvedValue('test-value');

      const result = await redisCache.get('test-key');

      expect(result).toBe('test-value');
      expect(mockRedisClient.get).toHaveBeenCalledWith('test-key');
    });

    it('should return null when error occurs', async () => {
      const error = new Error('Redis error');
      mockRedisClient.get.mockRejectedValue(error);

      const result = await redisCache.get('test-key');

      expect(result).toBeNull();
      expect(mockLogger.debugError).toHaveBeenCalledWith(
        'get Redis key',
        error,
      );
    });
  });

  describe('set', () => {
    it('should set value with ttl successfully', async () => {
      mockRedisClient.set.mockResolvedValue('OK');

      await redisCache.set('test-key', 'test-value', 3600);

      expect(mockRedisClient.set).toHaveBeenCalledWith(
        'test-key',
        'test-value',
        { ex: 3600 },
      );
    });

    it('should log error when set fails', async () => {
      const error = new Error('Redis error');
      mockRedisClient.set.mockRejectedValue(error);

      await redisCache.set('test-key', 'test-value', 3600);

      expect(mockLogger.debugError).toHaveBeenCalledWith(
        'set Redis key',
        error,
      );
    });
  });

  describe('del', () => {
    it('should delete key successfully', async () => {
      mockRedisClient.del.mockResolvedValue(1);

      await redisCache.del('test-key');

      expect(mockRedisClient.del).toHaveBeenCalledWith('test-key');
    });

    it('should log error when delete fails', async () => {
      const error = new Error('Redis error');
      mockRedisClient.del.mockRejectedValue(error);

      await redisCache.del('test-key');

      expect(mockLogger.debugError).toHaveBeenCalledWith(
        'del Redis key',
        error,
      );
    });
  });
});
