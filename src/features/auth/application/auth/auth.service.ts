import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthConfig } from '../../config/auth.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authConfig: AuthConfig,
  ) {}

  public async generateTokens(userId: string, deviceId: string) {
    const jwtPayload = { userId, deviceId };

    const [access, refresh] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.authConfig.jwtSecret,
        expiresIn: this.authConfig.jwtExpireTime,
      }),

      this.jwtService.signAsync(jwtPayload, {
        secret: this.authConfig.jwtRefreshSecret,
        expiresIn: this.authConfig.jwtRefreshExpireTime,
      }),
    ]);

    return { access, refresh };
  }

  public getSessionVersionAndExpirationDate(refreshToken: string) {
    const decodeResult = this.jwtService.decode(refreshToken);

    return {
      version: new Date(decodeResult.iat * 1000).toISOString(),
      expirationDate: new Date(Number(decodeResult.exp) * 1000),
    };
  }
}
