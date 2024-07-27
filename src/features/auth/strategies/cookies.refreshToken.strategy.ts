import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionRepo } from '../infrastructure/session.repo';

@Injectable()
export class CookieRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly sessionRepo: SessionRepo) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => request?.cookies?.['refreshToken'],
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    console.log('CookieRefreshTokenStrategy -> validate', payload);
    const sessionId = await this.sessionRepo.getByUserIdAndTokenKey(
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
