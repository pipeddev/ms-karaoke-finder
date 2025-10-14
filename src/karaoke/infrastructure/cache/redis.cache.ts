import { Injectable } from '@nestjs/common';
import { Redis } from '@upstash/redis';
import { Environment } from 'src/shared/config/environment';

@Injectable()
export class RedisCache {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      url: Environment.UPSTASH_REDIS_URL,
      token: Environment.UPSTASH_REDIS_TOKEN, // Necesitarás agregar esto a tu Environment
    });
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error(`Error getting key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    try {
      await this.client.set(key, value, { ex: ttlSeconds });
    } catch (error) {
      console.error(`Error setting key ${key}:`, error);
      throw error;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error(`Error deleting key ${key}:`, error);
    }
  }
}
