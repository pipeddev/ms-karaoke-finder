import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RedisCache } from '../cache/redis.cache';
import { Environment } from '../../../shared/config/environment';
import { firstValueFrom } from 'rxjs';
import { AppLogger } from 'src/shared/utils/logger/logger';

@Injectable()
export class SpotifyService {
  constructor(
    private readonly httpService: HttpService,
    private readonly redisCache: RedisCache,
    private readonly logger: AppLogger,
  ) {}

  async getAccessToken(): Promise<string> {
    const cacheKey = 'spotify:access_token';

    const cachedToken = await this.redisCache.get(cacheKey);
    if (cachedToken) {
      this.logger.debug('Using cached Spotify token');
      return cachedToken;
    }

    this.logger.debug('Fetching new Spotify token...');
    const auth = Buffer.from(
      `${Environment.SPOTIFY_CLIENT_ID}:${Environment.SPOTIFY_CLIENT_SECRET}`,
    ).toString('base64');

    const response = await firstValueFrom(
      this.httpService.post<{
        access_token: string;
        token_type: string;
        expires_in: number;
      }>(Environment.SPOTIFY_TOKEN_URL, 'grant_type=client_credentials', {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
    );

    const { access_token, expires_in } = response.data;

    await this.redisCache.set(cacheKey, access_token, expires_in - 60);
    return access_token;
  }
}
