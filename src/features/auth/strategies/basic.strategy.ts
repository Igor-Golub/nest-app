import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BasicStrategy as Strategy } from 'passport-http';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  public async validate(login: string, password: string) {
    const basicEmail = this.configService.get<string>('smtp.email');
    const basicPassword = this.configService.get<string>('smtp.password');

    if (!basicEmail || !basicPassword) {
      throw new UnauthorizedException();
    }

    if (basicEmail !== login || basicPassword !== password) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
