import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { AppLogger } from './shared/utils/logger/logger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const logger = new AppLogger('Global');
  app.useLogger(logger);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  logger.log(`🚀 App running on port ${process.env.APP_PORT || 3000}`);
}
void bootstrap();
