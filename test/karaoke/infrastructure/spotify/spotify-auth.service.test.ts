import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { SpotifyAuthService } from 'src/karaoke/infrastructure/spotify/spotify-auth.service';
import { RedisCache } from 'src/karaoke/infrastructure/cache/redis.cache';
import { Environment } from 'src/shared/config/environment';
import { of } from 'rxjs';

jest.mock('src/shared/logger/logger');

describe('SpotifyAuthService', () => {
  let service: SpotifyAuthService;
  let httpService: jest.Mocked<HttpService>;
  let redisCache: jest.Mocked<RedisCache>;

  const mockAccessToken = 'mock_access_token';
  const mockExpiresIn = 3600;
  const cacheKey = 'spotify:access_token';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpotifyAuthService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
        {
          provide: RedisCache,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SpotifyAuthService>(SpotifyAuthService);
    httpService = module.get(HttpService);
    redisCache = module.get(RedisCache);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAccessToken', () => {
    it('should return cached token if available', async () => {
      redisCache.get.mockResolvedValue(mockAccessToken);

      const result = await service.getAccessToken();

      expect(result).toBe(mockAccessToken);
      expect(redisCache.get).toHaveBeenCalledWith(cacheKey);
      expect(httpService.post).not.toHaveBeenCalled();
    });

    it('should fetch new token from Spotify API when cache is empty', async () => {
      redisCache.get.mockResolvedValue(null);
      httpService.post.mockReturnValue(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        of({
          data: {
            access_token: mockAccessToken,
            token_type: 'Bearer',
            expires_in: mockExpiresIn,
          },
        }) as any,
      );

      const result = await service.getAccessToken();

      expect(result).toBe(mockAccessToken);
      expect(redisCache.get).toHaveBeenCalledWith(cacheKey);
      expect(httpService.post).toHaveBeenCalledWith(
        Environment.SPOTIFY_TOKEN_URL,
        'grant_type=client_credentials',
        expect.objectContaining({
          headers: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            Authorization: expect.stringContaining('Basic '),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      );
    });

    it('should cache the new token with correct TTL', async () => {
      redisCache.get.mockResolvedValue(null);
      httpService.post.mockReturnValue(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        of({
          data: {
            access_token: mockAccessToken,
            token_type: 'Bearer',
            expires_in: mockExpiresIn,
          },
        }) as any,
      );

      await service.getAccessToken();

      expect(redisCache.set).toHaveBeenCalledWith(
        cacheKey,
        mockAccessToken,
        mockExpiresIn - 60,
      );
    });

    it('should use correct Basic Auth header with client credentials', async () => {
      redisCache.get.mockResolvedValue(null);
      httpService.post.mockReturnValue(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        of({
          data: {
            access_token: mockAccessToken,
            token_type: 'Bearer',
            expires_in: mockExpiresIn,
          },
        }) as any,
      );

      await service.getAccessToken();

      const expectedAuth = Buffer.from(
        `${Environment.SPOTIFY_CLIENT_ID}:${Environment.SPOTIFY_CLIENT_SECRET}`,
      ).toString('base64');

      expect(httpService.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          headers: expect.objectContaining({
            Authorization: `Basic ${expectedAuth}`,
          }),
        }),
      );
    });
  });
});
