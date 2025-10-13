import 'dotenv/config';

export const Environment = {
  // App Configuration
  APP_NAME: process.env.APP_NAME ?? 'ms-karaoke-finder',
  APP_PORT: +(process.env.APP_PORT ?? 3000),
  APP_ENV: process.env.APP_ENV ?? 'development',

  // Spotify API
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID ?? '',
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET ?? '',
  SPOTIFY_TOKEN_URL:
    process.env.SPOTIFY_TOKEN_URL ?? 'https://accounts.spotify.com/api/token',
  SPOTIFY_SEARCH_URL:
    process.env.SPOTIFY_SEARCH_URL ?? 'https://api.spotify.com/v1/search',
  SPOTIFY_ACCESS_TOKEN: process.env.SPOTIFY_ACCESS_TOKEN ?? '',

  // Redis (Upstash)
  UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL ?? '',
  UPSTASH_REDIS_TTL_SECONDS: +(process.env.UPSTASH_REDIS_TTL_SECONDS ?? 3600),

  // JWT (Auth)
  JWT_SECRET: process.env.JWT_SECRET ?? 'super_secret_key_change_me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '1h',

  // Rate Limiting
  RATE_LIMIT_TTL: +(process.env.RATE_LIMIT_TTL ?? 60),
  RATE_LIMIT_LIMIT: +(process.env.RATE_LIMIT_LIMIT ?? 100),

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL ?? 'debug',
};
