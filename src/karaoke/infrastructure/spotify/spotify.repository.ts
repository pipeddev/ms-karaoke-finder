import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { SongRepository } from '../../domain/repositories/song.repository';
import { Song } from '../../domain/entities/song.entity';
import { firstValueFrom } from 'rxjs';
import { Environment } from 'src/shared/config/environment';
import { SpotifyTrackResponse } from './dto/spotify-track.dto';
import { SpotifyMapper } from './spotify.mapper';

@Injectable()
export class SpotifyRepository implements SongRepository {
  constructor(private readonly httpService: HttpService) {}

  async searchByArtist(artist: string, token: string): Promise<Song[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<SpotifyTrackResponse>(
        Environment.SPOTIFY_SEARCH_URL,
        {
          params: { q: encodeURIComponent(artist), type: 'track', limit: 5 },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    );

    return SpotifyMapper.toDomain(data);
  }
}
