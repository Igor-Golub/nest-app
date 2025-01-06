import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyAppSettings } from './settings/applyAppSettings';
import { CoreConfig } from './core/core.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const coreConfig = app.get(CoreConfig);

  applyAppSettings(app);

  await app.listen(coreConfig.port);
}

bootstrap();
