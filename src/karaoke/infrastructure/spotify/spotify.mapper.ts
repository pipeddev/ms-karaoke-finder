import { Song } from '../../domain/entities/song.entity';
import { SpotifyTrackResponse } from './dto/spotify-track.dto';

export class SpotifyMapper {
  static toDomain(data: SpotifyTrackResponse): Song[] {
    return data.tracks.items.map(
      (track) =>
        new Song(
          track.id,
          track.name,
          track.artists[0]?.name ?? 'Unknown Artist',
          track.album.name,
          track.album.images.find((img) => img.width === 64)?.url ?? undefined,
        ),
    );
  }
}
