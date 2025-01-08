import { Request } from 'express';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionRepository } from '../infrastructure/session.repository';

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
  constructor(private sessionRepository: SessionRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.['refreshToken'],
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
    });
  }

  public async validate(payload: SessionPayload) {
    const sessions = await this.sessionRepository.findByField(
      'version',
      new Date(payload.iat * 1000).toISOString(),
    );

    if (!sessions.length) throw new UnauthorizedException();

    return {
      id: payload.userId,
      deviceId: payload.deviceId,
    };
  }
}
