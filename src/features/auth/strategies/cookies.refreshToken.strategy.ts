import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionRepo } from '../infrastructure/session.repo';

interface SessionPayload {
  userId: string;
  deviceId: string;
  iat: number;
  exp: number;
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
