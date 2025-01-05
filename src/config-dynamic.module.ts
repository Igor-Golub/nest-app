import { ConfigModule } from '@nestjs/config';
// import of this config module must be on top of imports

export const configModule = ConfigModule.forRoot({
  envFilePath: [
    process.env.ENV_FILE_PART?.trim() ?? '',
    `env.${process.env.NODE_ENV}.local`,
    `env.${process.env.NODE_ENV}`,
    'env.production',
  ].filter(Boolean),
  isGlobal: true,
});
