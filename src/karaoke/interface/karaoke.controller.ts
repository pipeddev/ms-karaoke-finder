import { Controller, Get, Query } from '@nestjs/common';
import { SearchSongsDto } from './dtos/requests/search-songs.dto';
import { SearchSongsUC } from '../application/use-cases/search-songs.uc';

@Controller('songs')
export class KaraokeController {
  constructor(private readonly searchSongsUseCase: SearchSongsUC) {}

  @Get()
  async search(@Query() dto: SearchSongsDto) {
    const songs = await this.searchSongsUseCase.execute(dto);
    return {
      status: 'success',
      data: songs,
    };
  }
}
