import { Module } from '@nestjs/common';
import { KaraokeController } from './interface/karaoke.controller';
import { HttpModule } from '@nestjs/axios';
import { SearchSongsUC } from './application/use-cases/search-songs.uc';
import { SpotifyRepository } from './infrastructure/spotify/spotify.repository';
import { RedisCache } from './infrastructure/cache/redis.cache';
import { SpotifyAuthService } from './infrastructure/spotify/spotify-auth.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [HttpModule, AuthModule],
  controllers: [KaraokeController],
  providers: [
    SearchSongsUC,
    { provide: 'SongRepository', useClass: SpotifyRepository },
    SpotifyAuthService,
    RedisCache,
  ],
})
export class KaraokeModule {}
