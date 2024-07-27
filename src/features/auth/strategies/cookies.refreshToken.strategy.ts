import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionRepo } from '../infrastructure/session.repo';

interface SessionPayload {
  userId: string;
  tokenKey: string;
  deviceId: string;
}

@Injectable()
export class CookieRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-cookie',
) {
  constructor(private readonly sessionRepo: SessionRepo) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.['refreshToken'];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
    });
  }

  async validate(payload: SessionPayload) {
    console.log('CookieRefreshTokenStrategy -> validate', payload);
    const sessionId = await this.sessionRepo.isUserSessionExist(
      payload.userId,
      payload.tokenKey,
    );

    if (!sessionId) throw new UnauthorizedException();

    return {
      id: payload.userId,
      tokenKey: payload.tokenKey,
      deviceId: payload.deviceId,
    };
  }
}
