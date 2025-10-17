import { Module } from '@nestjs/common';

import { HealthModule } from './health/health.module';
import { KaraokeModule } from './karaoke/karaoke.module';
import { LoggerModule } from './shared/utils/logger/logger.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { JSendInterceptor } from './shared/utils/jsend/jsend.interceptor';
import { JSendExceptionFilter } from './shared/utils/jsend/jsend.exception.filter';

@Module({
  imports: [LoggerModule, HealthModule, KaraokeModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: JSendInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: JSendExceptionFilter,
    },
  ],
})
export class AppModule {}
