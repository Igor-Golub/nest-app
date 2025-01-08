import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CoreEnvUtils } from '../../../core/core.env.utils';

@Injectable()
export class AuthConfig {
  @IsNotEmpty({
    message: 'Set correct JWT_SECRET value, ex.: 89u967',
  })
  public jwtSecret = this.configService.get('JWT_SECRET') as string;

  @IsNotEmpty({
    message: 'Set correct PASSWORD_SECRET value, ex.: 89u967',
  })
  public passwordSecret = this.configService.get('PASSWORD_SECRET') as string;

  @IsNotEmpty({
    message: 'Set correct HTTP_BASIC_USER value, ex.: user name',
  })
  public basicUser = this.configService.get('HTTP_BASIC_USER') as string;

  @IsNotEmpty({
    message: 'Set correct HTTP_BASIC_PASS value, ex.: 89u967',
  })
  public basicPassword = this.configService.get('HTTP_BASIC_PASS') as string;

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
  public jwtRefreshSecret = this.configService.get(
    'JWT_REFRESH_SECRET',
  ) as string;

  constructor(private configService: ConfigService) {
    CoreEnvUtils.validateConfig(this);
  }
}
