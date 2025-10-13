import { Module } from '@nestjs/common';

import { HealthModule } from './health/health.module';
import { KaraokeModule } from './karaoke/karaoke.module';

@Module({
  imports: [HealthModule, KaraokeModule],
  providers: [],
})
export class AppModule {}
