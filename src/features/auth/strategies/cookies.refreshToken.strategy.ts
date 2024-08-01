import { Request } from 'express';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionMongoRepo } from '../infrastructure/mongo/session.mongo.repo';

interface SessionPayload {
  iat: number;
  exp: number;
  userId: string;
  deviceId: string;
}

@Injectable()
export class CookieRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-cookie',
) {
  constructor(private sessionRepo: SessionMongoRepo) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.['refreshToken'],
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
    });
  }

  public async validate(payload: SessionPayload) {
    const session = await this.sessionRepo.findSession({
      version: new Date(payload.iat * 1000).toISOString(),
    });

    if (!session) throw new UnauthorizedException();

    return {
      id: payload.userId,
      deviceId: payload.deviceId,
    };
  }
}
