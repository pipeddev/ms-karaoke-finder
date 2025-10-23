import { Test, TestingModule } from '@nestjs/testing';
import { KaraokeController } from '../../../src/karaoke/interface/karaoke.controller';
import { SearchSongsUC } from '../../../src/karaoke/application/use-cases/search-songs.uc';
import { SearchSongsDto } from '../../../src/karaoke/interface/dtos/requests/search-songs.dto';
import { AuthenticatedUserDTO } from '../../../src/shared/security/dtos/authenticated-user.dto';
import { JSendDTO } from '../../../src/shared/dtos/jsend.dto';
import { Song } from '../../../src/karaoke/domain/entities/song.entity';
import { Logger } from '@nestjs/common';
import { JwtAuthService } from 'src/auth/infrastructure/jwt/jwt-auth.service';

describe('KaraokeController', () => {
  let controller: KaraokeController;
  let searchSongsUseCase: SearchSongsUC;

  const mockSearchSongsUC = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KaraokeController],
      providers: [
        {
          provide: SearchSongsUC,
          useValue: mockSearchSongsUC,
        },
        {
          provide: JwtAuthService,
          useValue: {
            issueToken: jest.fn(),
            verifyToken: jest.fn(),
            decodeToken: jest.fn(),
            extractDeviceId: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<KaraokeController>(KaraokeController);
    searchSongsUseCase = module.get<SearchSongsUC>(SearchSongsUC);

    jest.spyOn(Logger.prototype, 'debug').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should have searchSongsUseCase injected', () => {
      expect(searchSongsUseCase).toBeDefined();
    });
  });

  describe('search', () => {
    it('should return songs wrapped in JSendDTO', async () => {
      const searchDto: SearchSongsDto = {
        query: 'test song',
      } as unknown as SearchSongsDto;
      const user: AuthenticatedUserDTO = {
        deviceId: 'device123',
      } as AuthenticatedUserDTO;
      const mockSongs: Song[] = [
        { id: '1', title: 'Test Song 1' } as Song,
        { id: '2', title: 'Test Song 2' } as Song,
      ];

      mockSearchSongsUC.execute.mockResolvedValue(mockSongs);

      const result = await controller.search(searchDto, user);

      expect(searchSongsUseCase.execute).toHaveBeenCalledWith(searchDto);
      expect(result).toEqual(JSendDTO.success(mockSongs));
    });

    it('should log debug message with user and search criteria', async () => {
      const searchDto: SearchSongsDto = {
        query: 'test',
      } as unknown as SearchSongsDto;
      const user: AuthenticatedUserDTO = {
        deviceId: 'device456',
      } as AuthenticatedUserDTO;
      const loggerSpy = jest.spyOn(Logger.prototype, 'debug');

      mockSearchSongsUC.execute.mockResolvedValue([]);

      await controller.search(searchDto, user);

      expect(loggerSpy).toHaveBeenCalledWith(
        `User device456 is searching for songs with criteria: ${JSON.stringify(searchDto)}`,
      );
    });

    it('should handle empty results', async () => {
      const searchDto: SearchSongsDto = {
        query: 'nonexistent',
      } as unknown as SearchSongsDto;
      const user: AuthenticatedUserDTO = {
        deviceId: 'device789',
      } as AuthenticatedUserDTO;

      mockSearchSongsUC.execute.mockResolvedValue([]);

      const result = await controller.search(searchDto, user);

      expect(result).toEqual(JSendDTO.success([]));
    });

    it('should propagate errors from use case', async () => {
      const searchDto: SearchSongsDto = {
        query: 'error',
      } as unknown as SearchSongsDto;
      const user: AuthenticatedUserDTO = {
        deviceId: 'device000',
      } as AuthenticatedUserDTO;
      const error = new Error('Use case error');

      mockSearchSongsUC.execute.mockRejectedValue(error);

      await expect(controller.search(searchDto, user)).rejects.toThrow(error);
    });

    it('should handle complex search queries', async () => {
      const searchDto: SearchSongsDto = {
        query: 'complex query with special chars !@#',
      } as unknown as SearchSongsDto;
      const user: AuthenticatedUserDTO = {
        deviceId: 'device999',
      } as AuthenticatedUserDTO;
      const mockSongs: Song[] = [{ id: '3', title: 'Complex Song' } as Song];

      mockSearchSongsUC.execute.mockResolvedValue(mockSongs);

      const result = await controller.search(searchDto, user);

      expect(result).toEqual(JSendDTO.success(mockSongs));
      expect(result.data).toHaveLength(1);
    });

    it('should handle null or undefined user deviceId gracefully', async () => {
      const searchDto: SearchSongsDto = {
        query: 'test',
      } as unknown as SearchSongsDto;
      const user: AuthenticatedUserDTO = {
        deviceId: undefined,
      } as unknown as AuthenticatedUserDTO;

      mockSearchSongsUC.execute.mockResolvedValue([]);

      await controller.search(searchDto, user);

      expect(mockSearchSongsUC.execute).toHaveBeenCalledWith(searchDto);
    });
  });
});
