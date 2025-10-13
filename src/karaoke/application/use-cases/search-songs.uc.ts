import { Inject, Injectable } from '@nestjs/common';
import { Song } from '../../domain/entities/song.entity';
import { SearchSongsDto } from 'src/karaoke/interface/dtos/requests/search-songs.dto';
import type { SongRepository } from 'src/karaoke/domain/repositories/song.repository';

@Injectable()
export class SearchSongsUC {
  constructor(
    @Inject('SongRepository') private readonly songRepository: SongRepository,
  ) {}

  async execute(dto: SearchSongsDto): Promise<Song[]> {
    return this.songRepository.searchByArtist(dto.artist);
  }
}
