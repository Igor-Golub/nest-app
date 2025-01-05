import { ConfigService } from '@nestjs/config';
import { IsBoolean, IsEnum, IsNumber } from 'class-validator';

enum EnvironmentTypes {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TESTING = 'testing',
}

export class CoreConfigModule {
  @IsNumber(
    {},
    {
      message: 'Set correct PORT value, ex.: 3000',
    },
  )
  public port = Number(this.configService.get('PORT'));

  @IsEnum(EnvironmentTypes, {
    message: 'Set correct NODE_ENV value, ex.: development',
  })
  public env = this.configService.get('NODE_ENV') as string;

  @IsBoolean({
    message: 'Set correct IS_SWAGGER_ENABLED value, ex.: false',
  })
  public isSwaggerEnabled = this.configService.get('IS_SWAGGER_ENABLED');

  constructor(private configService: ConfigService) {}
}
