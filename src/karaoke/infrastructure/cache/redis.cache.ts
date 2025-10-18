import { Injectable } from '@nestjs/common';
import { Redis } from '@upstash/redis';
import { Environment } from 'src/shared/config/environment';
import { LoggerHelper } from 'src/shared/logger/logger';

@Injectable()
export class RedisCache {
  private readonly logger = new LoggerHelper(RedisCache.name);
  private client: Redis;

  constructor() {
    this.client = new Redis({
      url: Environment.UPSTASH_REDIS_URL,
      token: Environment.UPSTASH_REDIS_TOKEN,
    });
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      this.logger.debugError('get Redis key', error as Error);
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    try {
      await this.client.set(key, value, { ex: ttlSeconds });
    } catch (error) {
      this.logger.debugError('set Redis key', error as Error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      this.logger.debugError('del Redis key', error as Error);
    }
  }
}
