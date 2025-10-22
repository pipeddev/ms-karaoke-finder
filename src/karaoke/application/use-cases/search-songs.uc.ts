import { Inject, Injectable } from '@nestjs/common';
import { Song } from '../../domain/entities/song.entity';
import { SearchSongsDto } from 'src/karaoke/interface/dtos/requests/search-songs.dto';
import type { SongRepository } from 'src/karaoke/domain/repositories/song.repository';
import { SpotifyAuthService } from 'src/karaoke/infrastructure/spotify/spotify-auth.service';

@Injectable()
export class SearchSongsUC {
  constructor(
    @Inject('SongRepository') private readonly songRepository: SongRepository,
    private readonly spotifyAuthService: SpotifyAuthService,
  ) {}

  async execute(dto: SearchSongsDto): Promise<Song[]> {
    const token = await this.spotifyAuthService.getAccessToken();
    return this.songRepository.searchByArtist(dto.artist, token);
  }
}
