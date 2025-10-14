import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { SongRepository } from '../../domain/repositories/song.repository';
import { Song } from '../../domain/entities/song.entity';
import { firstValueFrom } from 'rxjs';
import { Environment } from 'src/environment';
import { SpotifyTrackResponse } from './dto/spotify-track.dto';
import { SpotifyMapper } from './spotify.mapper';

@Injectable()
export class SpotifyRepository implements SongRepository {
  constructor(private readonly httpService: HttpService) {}

  async searchByArtist(artist: string): Promise<Song[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<SpotifyTrackResponse>(
        Environment.SPOTIFY_SEARCH_URL,
        {
          params: { q: encodeURIComponent(artist), type: 'track', limit: 5 },
          headers: {
            Authorization: `Bearer ${Environment.SPOTIFY_ACCESS_TOKEN}`,
          },
        },
      ),
    );

    return SpotifyMapper.toDomain(data);
  }
}
