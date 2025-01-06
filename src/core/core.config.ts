import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { EnvironmentTypes } from '../common/enums';
import { CoreEnvUtils } from './core.env.utils';

@Injectable()
export class CoreConfig {
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
  public env = this.configService.get('NODE_ENV') as EnvironmentTypes;

  @IsBoolean({
    message: 'Set correct IS_SWAGGER_ENABLED value, ex.: false',
  })
  public isSwaggerEnabled = CoreEnvUtils.convertToBoolean(
    this.configService.get('IS_SWAGGER_ENABLED'),
  );

  @IsNumber(
    {},
    {
      message: 'Set correct TH_TTL value, ex.: 10',
    },
  )
  public throttleTTL = Number(this.configService.get('TH_TTL'));

  @IsNumber(
    {},
    {
      message: 'Set correct TH_LIMIT value, ex.: 5',
    },
  )
  public throttleLimit = Number(this.configService.get('TH_LIMIT'));

  @IsNotEmpty({
    message: 'Set correct HOST_URL value, ex.: http//*',
  })
  public frontURL = this.configService.get('HOST_URL');

  @IsNotEmpty({
    message: 'Set correct SMTP_EMAIL value, ex.: someEmail@.com',
  })
  public smtpEmail = this.configService.get('SMTP_EMAIL');

  @IsNotEmpty({
    message: 'Set correct SMTP_PASSWORD value, ex.: 8dy9as',
  })
  public smtpPassword = this.configService.get('SMTP_PASSWORD');

  // DB
  @IsNotEmpty({
    message: 'Set correct MONGO_URL value, ex.: http//*',
  })
  public mongoURI = this.configService.get('MONGO_URL');

  @IsNotEmpty({
    message: 'Set correct POSTGRES_DB_HOST value, ex.: http//*',
  })
  public host = this.configService.get('POSTGRES_DB_HOST');

  @IsNumber(
    {},
    {
      message: 'Set correct POSTGRES_DB_PORT value, ex.: 6000',
    },
  )
  public dbPort = Number(this.configService.get('POSTGRES_DB_PORT'));

  @IsNotEmpty({
    message: 'Set correct POSTGRES_DB_NAME value, ex.: cats db',
  })
  public name = this.configService.get('POSTGRES_DB_NAME');

  @IsNotEmpty({
    message: 'Set correct POSTGRES_DB_USER_NAME value, ex.: some name',
  })
  public user = this.configService.get('POSTGRES_DB_USER_NAME');

  @IsNotEmpty({
    message: 'Set correct POSTGRES_DB_PASSWORD value, ex.: e23edsd',
  })
  public pass = this.configService.get('POSTGRES_DB_PASSWORD');

  constructor(private configService: ConfigService) {
    CoreEnvUtils.validateConfig(this);
  }
}
