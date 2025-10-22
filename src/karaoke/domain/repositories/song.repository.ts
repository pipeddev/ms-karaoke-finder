import { Song } from '../entities/song.entity';

export interface SongRepository {
  searchByArtist(artist: string, token: string): Promise<Song[]>;
}
