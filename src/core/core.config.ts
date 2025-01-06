import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  validateSync,
} from 'class-validator';
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

  // Auth
  @IsNotEmpty({
    message: 'Set correct JWT_SECRET value, ex.: 89u967',
  })
  public jwtSecret = this.configService.get('JWT_SECRET');

  @IsNotEmpty({
    message: 'Set correct PASSWORD_SECRET value, ex.: 89u967',
  })
  public passwordSecret = this.configService.get('PASSWORD_SECRET');

  @IsNotEmpty({
    message: 'Set correct HTTP_BASIC_USER value, ex.: user name',
  })
  public basicUser = this.configService.get('HTTP_BASIC_USER');

  @IsNotEmpty({
    message: 'Set correct HTTP_BASIC_PASS value, ex.: 89u967',
  })
  public basicPassword = this.configService.get('HTTP_BASIC_PASS');

  @IsNumber(
    {},
    {
      message: 'Set correct JWT_EXPIRE_TIME value, ex.: 40',
    },
  )
  public jwtExpireTime = Number(this.configService.get('JWT_EXPIRE_TIME'));

  @IsNumber(
    {},
    {
      message: 'Set correct JWT_REFRESH_EXPIRE_TIME value, ex.: 40',
    },
  )
  public jwtRefreshExpireTime = Number(
    this.configService.get('JWT_REFRESH_EXPIRE_TIME'),
  );

  @IsNotEmpty({
    message: 'Set correct JWT_REFRESH_SECRET value, ex.: 2312dsad',
  })
  public jwtRefreshSecret = this.configService.get('JWT_REFRESH_SECRET');

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
    const errors = validateSync(this);

    if (errors.length) {
      const sortedMessages = errors
        .map((error) => Object.values(error.constraints || {}).join(', '))
        .join(', ');

      throw new Error('Validation failed: ' + sortedMessages);
    }
  }
}
