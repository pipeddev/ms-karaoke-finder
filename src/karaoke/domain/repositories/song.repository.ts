import { Song } from '../entities/song.entity';

export interface SongRepository {
  searchByArtist(artist: string): Promise<Song[]>;
}
