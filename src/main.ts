import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyAppSettings } from './settings/applyAppSettings';
import { CoreConfig } from './core/core.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const coreConfig = app.get(CoreConfig);

  applyAppSettings(app);

  console.log(`Server started on ${coreConfig.port}`);
  await app.listen(coreConfig.port);
}

bootstrap();
