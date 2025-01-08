import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BasicStrategy as Strategy } from 'passport-http';
import { PassportStrategy } from '@nestjs/passport';
import { AuthConfig } from '../config/auth.config';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authConfig: AuthConfig) {
    super();
  }

  public async validate(login: string, password: string) {
    const basicEmail = this.authConfig.basicUser;
    const basicPassword = this.authConfig.basicPassword;

    if (!basicEmail || !basicPassword) {
      throw new UnauthorizedException();
    }

    if (basicEmail !== login || basicPassword !== password) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
