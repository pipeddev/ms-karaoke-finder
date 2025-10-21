import { Controller, Get, Logger, Query, UseGuards } from '@nestjs/common';
import { SearchSongsDto } from './dtos/requests/search-songs.dto';
import { SearchSongsUC } from '../application/use-cases/search-songs.uc';
import { AuthGuard } from 'src/shared/security/auth.guard';
import { CurrentUser } from 'src/shared/security/decorator/current-user.decorator';
import { AuthenticatedUserDTO } from 'src/shared/security/dtos/authenticated-user.dto';

@Controller('songs')
@UseGuards(AuthGuard)
export class KaraokeController {
  private logger = new Logger(KaraokeController.name);
  constructor(private readonly searchSongsUseCase: SearchSongsUC) {}

  @Get()
  async search(
    @Query() dto: SearchSongsDto,
    @CurrentUser() user: AuthenticatedUserDTO,
  ) {
    this.logger.debug(
      `User ${user.deviceId} is searching for songs with criteria: ${JSON.stringify(dto)}`,
    );
    const songs = await this.searchSongsUseCase.execute(dto);
    return {
      status: 'success',
      data: { songs },
    };
  }
}
