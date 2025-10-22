import { Test, TestingModule } from '@nestjs/testing';
import { SearchSongsUC } from 'src/karaoke/application/use-cases/search-songs.uc';
import { Song } from 'src/karaoke/domain/entities/song.entity';
import { SongRepository } from 'src/karaoke/domain/repositories/song.repository';
import { SpotifyAuthService } from 'src/karaoke/infrastructure/spotify/spotify-auth.service';
import { SearchSongsDto } from 'src/karaoke/interface/dtos/requests/search-songs.dto';

describe('SearchSongsUC', () => {
  let useCase: SearchSongsUC;
  let songRepository: jest.Mocked<SongRepository>;
  let spotifyAuthService: jest.Mocked<SpotifyAuthService>;

  beforeEach(async () => {
    const mockSongRepository = {
      searchByArtist: jest.fn(),
    };

    const mockSpotifyAuthService = {
      getAccessToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchSongsUC,
        {
          provide: 'SongRepository',
          useValue: mockSongRepository,
        },
        {
          provide: SpotifyAuthService,
          useValue: mockSpotifyAuthService,
        },
      ],
    }).compile();

    useCase = module.get<SearchSongsUC>(SearchSongsUC);
    songRepository = module.get('SongRepository');
    spotifyAuthService = module.get(SpotifyAuthService);
  });

  describe('execute', () => {
    it('should get access token and search songs by artist', async () => {
      const dto: SearchSongsDto = { artist: 'The Beatles' };
      const token = 'mock-access-token';
      const mockSongs: Song[] = [
        new Song('1', 'Hey Jude', 'The Beatles', 'album1', 'url1'),
        new Song('2', 'Let It Be', 'The Beatles', 'album2', 'url2'),
      ];

      spotifyAuthService.getAccessToken.mockResolvedValue(token);
      songRepository.searchByArtist.mockResolvedValue(mockSongs);

      const result = await useCase.execute(dto);

      expect(spotifyAuthService.getAccessToken).toHaveBeenCalledTimes(1);
      expect(songRepository.searchByArtist).toHaveBeenCalledWith(
        dto.artist,
        token,
      );
      expect(result).toEqual(mockSongs);
      expect(result[0]).toBeInstanceOf(Song);
    });

    it('should return empty array when no songs found', async () => {
      const dto: SearchSongsDto = { artist: 'Unknown Artist' };
      const token = 'mock-access-token';

      spotifyAuthService.getAccessToken.mockResolvedValue(token);
      songRepository.searchByArtist.mockResolvedValue([]);

      const result = await useCase.execute(dto);

      expect(result).toEqual([]);
      expect(songRepository.searchByArtist).toHaveBeenCalledWith(
        dto.artist,
        token,
      );
    });

    it('should throw error when spotify auth fails', async () => {
      const dto: SearchSongsDto = { artist: 'The Beatles' };
      const error = new Error('Auth failed');

      spotifyAuthService.getAccessToken.mockRejectedValue(error);

      await expect(useCase.execute(dto)).rejects.toThrow('Auth failed');
      expect(songRepository.searchByArtist).not.toHaveBeenCalled();
    });

    it('should throw error when repository search fails', async () => {
      const dto: SearchSongsDto = { artist: 'The Beatles' };
      const token = 'mock-access-token';
      const error = new Error('Repository error');

      spotifyAuthService.getAccessToken.mockResolvedValue(token);
      songRepository.searchByArtist.mockRejectedValue(error);

      await expect(useCase.execute(dto)).rejects.toThrow('Repository error');
    });
  });
});
