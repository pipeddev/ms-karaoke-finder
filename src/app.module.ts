import { Module } from '@nestjs/common';

import { HealthModule } from './health/health.module';
import { KaraokeModule } from './karaoke/karaoke.module';
import { AuthModule } from './auth/auth.module';
import { ValidatorUtils } from './shared/utils/validator.utils';

@Module({
  imports: [HealthModule, KaraokeModule, AuthModule],
  providers: [ValidatorUtils],
  exports: [ValidatorUtils],
})
export class AppModule {}
