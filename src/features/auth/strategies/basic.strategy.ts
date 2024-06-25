import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BasicStrategy as Strategy } from 'passport-http';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  public async validate(login: string, password: string) {
    if (
      process.env.HTTP_BASIC_USER !== login ||
      process.env.HTTP_BASIC_PASS !== password
    ) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
