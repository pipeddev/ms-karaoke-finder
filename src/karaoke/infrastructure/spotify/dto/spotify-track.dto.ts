export interface SpotifyTrackResponse {
  tracks: {
    items: SpotifyTrackItem[];
  };
}

export interface SpotifyTrackItem {
  id: string;
  name: string;
  preview_url: string | null;
  popularity: number;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
}

export interface SpotifyArtist {
  id: string;
  name: string;
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyAlbumImage[];
}

export interface SpotifyAlbumImage {
  url: string;
  width: number;
  height: number;
}
