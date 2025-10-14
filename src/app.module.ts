import { Module } from '@nestjs/common';

import { HealthModule } from './health/health.module';
import { KaraokeModule } from './karaoke/karaoke.module';
import { LoggerModule } from './shared/utils/logger/logger.module';

@Module({
  imports: [LoggerModule, HealthModule, KaraokeModule],
  providers: [],
})
export class AppModule {}
