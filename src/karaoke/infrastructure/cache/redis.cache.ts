import { Injectable } from '@nestjs/common';
import { Redis } from '@upstash/redis';
import { Environment } from 'src/shared/config/environment';
import { AppLogger } from 'src/shared/utils/logger/logger';

@Injectable()
export class RedisCache {
  private client: Redis;

  constructor(private readonly logger: AppLogger) {
    this.client = new Redis({
      url: Environment.UPSTASH_REDIS_URL,
      token: Environment.UPSTASH_REDIS_TOKEN,
    });
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      this.logger.error(
        `Error getting key ${key}: ${error instanceof Error ? error.message : String(error)}`,
      );
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    try {
      await this.client.set(key, value, { ex: ttlSeconds });
    } catch (error) {
      this.logger.error(
        `Error setting key ${key}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      this.logger.error(
        `Error deleting key ${key}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
