import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { SpotifyRepository } from 'src/karaoke/infrastructure/spotify/spotify.repository';
import { SpotifyMapper } from 'src/karaoke/infrastructure/spotify/spotify.mapper';
import { Environment } from 'src/shared/config/environment';
import { of, throwError } from 'rxjs';
import { SpotifyTrackResponse } from 'src/karaoke/infrastructure/spotify/dto/spotify-track.dto';
import { Song } from 'src/karaoke/domain/entities/song.entity';

jest.mock('src/karaoke/infrastructure/spotify/spotify.mapper');

interface MockAxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: any;
}

describe('SpotifyRepository', () => {
  let repository: SpotifyRepository;
  let httpService: HttpService;

  const mockSpotifyResponse = {
    tracks: {
      items: [
        {
          id: '1',
          name: 'Song 1',
          artists: [{ name: 'Artist 1' }],
          album: { name: 'Album 1' },
        },
      ],
    },
  };

  const mockSongs = [
    new Song(
      '1',
      'Song 1',
      'Artist 1',
      'Album 1',
      'http://image.jpg',
      'http://preview.mp3',
    ),
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpotifyRepository,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<SpotifyRepository>(SpotifyRepository);
    httpService = module.get<HttpService>(HttpService);

    jest.clearAllMocks();
  });

  describe('searchByArtist', () => {
    it('should return songs when artist is found', async () => {
      const artist = 'The Beatles';
      const token = 'test-token';
      const axiosResponse: MockAxiosResponse = {
        data: mockSpotifyResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(axiosResponse));
      (SpotifyMapper.toDomain as jest.Mock).mockReturnValue(mockSongs);

      const result = await repository.searchByArtist(artist, token);

      expect(result).toEqual(mockSongs);
      expect(result[0]).toBeInstanceOf(Song);
      expect(SpotifyMapper.toDomain).toHaveBeenCalledWith(mockSpotifyResponse);
    });

    it('should return empty array when no tracks found', async () => {
      const artist = 'Unknown Artist';
      const token = 'test-token';
      const emptyResponse = {
        tracks: {
          items: [],
        },
      };
      const axiosResponse: MockAxiosResponse = {
        data: emptyResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(axiosResponse));
      (SpotifyMapper.toDomain as jest.Mock).mockReturnValue([]);

      const result = await repository.searchByArtist(artist, token);

      expect(result).toEqual([]);
      expect(SpotifyMapper.toDomain).toHaveBeenCalledWith(emptyResponse);
    });

    it('should handle empty artist string', async () => {
      const artist = '';
      const token = 'test-token';
      const axiosResponse: MockAxiosResponse = {
        data: mockSpotifyResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(axiosResponse));
      (SpotifyMapper.toDomain as jest.Mock).mockReturnValue(mockSongs);

      const result = await repository.searchByArtist(artist, token);

      expect(httpService.get).toHaveBeenCalledWith(
        Environment.SPOTIFY_SEARCH_URL,
        expect.objectContaining({
          params: {
            q: encodeURIComponent(artist),
            type: 'track',
            limit: 5,
          },
        }),
      );
      expect(result).toEqual(mockSongs);
    });

    it('should include authorization header with correct format', async () => {
      const artist = 'Test Artist';
      const token = 'my-access-token-123';
      const axiosResponse: MockAxiosResponse = {
        data: mockSpotifyResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(axiosResponse));
      (SpotifyMapper.toDomain as jest.Mock).mockReturnValue(mockSongs);

      await repository.searchByArtist(artist, token);

      expect(httpService.get).toHaveBeenCalledWith(
        Environment.SPOTIFY_SEARCH_URL,
        expect.objectContaining({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );
    });

    it('should handle unicode characters in artist name', async () => {
      const artist = 'Café Tacvba ñ';
      const token = 'test-token';
      const axiosResponse: MockAxiosResponse = {
        data: mockSpotifyResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(axiosResponse));
      (SpotifyMapper.toDomain as jest.Mock).mockReturnValue(mockSongs);

      await repository.searchByArtist(artist, token);

      expect(httpService.get).toHaveBeenCalledWith(
        Environment.SPOTIFY_SEARCH_URL,
        expect.objectContaining({
          params: {
            q: encodeURIComponent(artist),
            type: 'track',
            limit: 5,
          },
        }),
      );
    });

    it('should propagate HTTP errors correctly', async () => {
      const artist = 'Test Artist';
      const token = 'invalid-token';
      const axiosError = {
        response: {
          status: 401,
          data: { error: 'Unauthorized' },
        },
        message: 'Request failed with status code 401',
      };

      jest
        .spyOn(httpService, 'get')
        .mockReturnValue(throwError(() => axiosError));

      await expect(
        repository.searchByArtist(artist, token),
      ).rejects.toMatchObject({
        message: 'Request failed with status code 401',
      });
    });
  });
});

// Tests for SpotifyMapper using the real implementation
describe('SpotifyMapper', () => {
  // Remove the mock for this describe
  beforeAll(() => {
    jest.unmock('src/karaoke/infrastructure/spotify/spotify.mapper');
  });

  describe('toDomain', () => {
    it('should map spotify response to Song entities', () => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const { SpotifyMapper: RealMapper } = jest.requireActual(
        'src/karaoke/infrastructure/spotify/spotify.mapper',
      ) as { SpotifyMapper: typeof SpotifyMapper };

      const spotifyResponse: SpotifyTrackResponse = {
        tracks: {
          items: [
            {
              id: '1',
              name: 'Hey Jude',
              artists: [{ name: 'The Beatles', id: '1' }],
              album: {
                name: 'Hey Jude',
                images: [
                  { url: 'https://album-image.jpg', width: 64, height: 64 },
                ],
                id: 'album1',
              },
              preview_url: 'https://preview.mp3',
              popularity: 85,
            },
          ],
        },
      };

      const result = RealMapper.toDomain(spotifyResponse);

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Song);
      expect(result[0].id).toBe('1');
      expect(result[0].title).toBe('Hey Jude');
      expect(result[0].artist).toBe('The Beatles');
      expect(result[0].album).toBe('Hey Jude');
      expect(result[0].imageUrl).toBe('https://album-image.jpg');
    });

    it('should handle empty tracks array', () => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const { SpotifyMapper: RealMapper } = jest.requireActual(
        'src/karaoke/infrastructure/spotify/spotify.mapper',
      ) as { SpotifyMapper: typeof SpotifyMapper };

      const spotifyResponse: SpotifyTrackResponse = {
        tracks: {
          items: [],
        },
      };

      const result = RealMapper.toDomain(spotifyResponse);

      expect(result).toEqual([]);
    });

    it('should handle multiple tracks in response', () => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const { SpotifyMapper: RealMapper } = jest.requireActual(
        'src/karaoke/infrastructure/spotify/spotify.mapper',
      ) as { SpotifyMapper: typeof SpotifyMapper };

      const spotifyResponse: SpotifyTrackResponse = {
        tracks: {
          items: [
            {
              id: '1',
              name: 'Song 1',
              artists: [{ name: 'Artist 1', id: '1' }],
              album: {
                name: 'Album 1',
                images: [{ url: 'https://image1.jpg', width: 64, height: 64 }],
                id: 'album1',
              },
              preview_url: 'https://preview1.mp3',
              popularity: 80,
            },
            {
              id: '2',
              name: 'Song 2',
              artists: [{ name: 'Artist 2', id: '2' }],
              album: {
                name: 'Album 2',
                images: [{ url: 'https://image2.jpg', width: 64, height: 64 }],
                id: 'album2',
              },
              preview_url: 'https://preview2.mp3',
              popularity: 75,
            },
          ],
        },
      };

      const result = RealMapper.toDomain(spotifyResponse);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
    });

    it('should handle track with empty images array', () => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const { SpotifyMapper: RealMapper } = jest.requireActual(
        'src/karaoke/infrastructure/spotify/spotify.mapper',
      ) as { SpotifyMapper: typeof SpotifyMapper };

      const spotifyResponse: SpotifyTrackResponse = {
        tracks: {
          items: [
            {
              id: '1',
              name: 'Song',
              artists: [{ name: 'Artist', id: '1' }],
              album: {
                name: 'Album',
                images: [],
                id: 'album1',
              },
              preview_url: 'https://preview.mp3',
              popularity: 60,
            },
          ],
        },
      };

      const result = RealMapper.toDomain(spotifyResponse);

      expect(result).toHaveLength(1);
      expect(result[0].imageUrl).toBeUndefined();
    });

    it('should handle track with multiple artists', () => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const { SpotifyMapper: RealMapper } = jest.requireActual(
        'src/karaoke/infrastructure/spotify/spotify.mapper',
      ) as { SpotifyMapper: typeof SpotifyMapper };

      const spotifyResponse: SpotifyTrackResponse = {
        tracks: {
          items: [
            {
              id: '1',
              name: 'Collaboration',
              artists: [
                { name: 'Artist 1', id: '1' },
                { name: 'Artist 2', id: '2' },
              ],
              album: {
                name: 'Album',
                images: [{ url: 'https://image.jpg', width: 64, height: 64 }],
                id: 'album1',
              },
              preview_url: 'https://preview.mp3',
              popularity: 90,
            },
          ],
        },
      };

      const result = RealMapper.toDomain(spotifyResponse);

      expect(result).toHaveLength(1);
      expect(result[0].artist).toBe('Artist 1');
    });
  });
});
