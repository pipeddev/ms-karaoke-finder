import { Module } from '@nestjs/common';
import { KaraokeController } from './interface/karaoke.controller';
import { HttpModule } from '@nestjs/axios';
import { SearchSongsUC } from './application/use-cases/search-songs.uc';
import { SpotifyRepository } from './infrastructure/spotify/spotify.repository';
import { RedisCache } from './infrastructure/cache/redis.cache';
import { SpotifyService } from './infrastructure/spotify/spotify.service';

@Module({
  imports: [HttpModule],
  controllers: [KaraokeController],
  providers: [
    SearchSongsUC,
    { provide: 'SongRepository', useClass: SpotifyRepository },
    SpotifyService,
    RedisCache,
  ],
})
export class KaraokeModule {}
