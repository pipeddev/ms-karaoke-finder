import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RedisCache } from '../cache/redis.cache';
import { Environment } from '../../../shared/config/environment';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SpotifyService {
  private readonly logger = new Logger(SpotifyService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly redisCache: RedisCache,
  ) {}

  async getAccessToken(): Promise<string> {
    const cacheKey = 'spotify:access_token';

    // 1️⃣ Verificar si ya hay un token en Redis
    const cachedToken = await this.redisCache.get(cacheKey);
    if (cachedToken) {
      this.logger.debug('Using cached Spotify token');
      return cachedToken;
    }

    // 2️⃣ Pedir nuevo token a Spotify
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

    // 3️⃣ Guardar token en Redis por su duración
    await this.redisCache.set(cacheKey, access_token, expires_in - 60); // un margen de 1 min
    return access_token;
  }
}
