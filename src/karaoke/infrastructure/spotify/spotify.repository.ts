import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { SongRepository } from '../../domain/repositories/song.repository';
import { Song } from '../../domain/entities/song.entity';
import { firstValueFrom } from 'rxjs';
import { Environment } from 'src/shared/config/environment';
import { SpotifyTrackResponse } from './dto/spotify-track.dto';
import { SpotifyMapper } from './spotify.mapper';
import { SpotifyService } from './spotify.service';

@Injectable()
export class SpotifyRepository implements SongRepository {
  constructor(
    private readonly httpService: HttpService,
    private readonly spotifyService: SpotifyService,
  ) {}

  async searchByArtist(artist: string): Promise<Song[]> {
    const token = await this.spotifyService.getAccessToken();

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
