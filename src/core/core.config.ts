import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { EnvironmentTypes } from '../common/enums';
import { CoreEnvUtils } from './core.env.utils';
import { PostgresLoggingLevels } from '../common/enums/env';
import { LogLevel } from 'typeorm';

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
  public isSwaggerEnabled = CoreEnvUtils.convertToBoolean(this.configService.get('IS_SWAGGER_ENABLED'));

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

  @IsNotEmpty({
    message: 'Set correct MONGO_URL value, ex.: http//*',
  })
  public mongoURI = this.configService.get('MONGO_URL');

  @IsNotEmpty({
    message: 'Set correct POSTGRES_DB_URL value, ex.: postgresql://*',
  })
  public postgresURL = this.configService.get('POSTGRES_DB_URL');

  @IsEnum(PostgresLoggingLevels, {
    message: 'Set correct POSTGRES_LOGGER value, ex.: query',
  })
  public postgresLoggingLevel = this.configService.get('POSTGRES_LOGGER') as LogLevel;

  constructor(private configService: ConfigService) {
    CoreEnvUtils.validateConfig(this);
  }
}
