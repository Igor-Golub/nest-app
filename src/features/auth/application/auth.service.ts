import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  public async generateTokens(userId: string, deviceId: string) {
    const jwtPayload = { userId, deviceId };

    const [access, refresh] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('auth.jwtSecret'),
        expiresIn: this.config.get<string>('auth.jwtExpireTime'),
      }),

      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('auth.jwtRefreshSecret'),
        expiresIn: this.config.get<string>('auth.jwtRefreshExpireTime'),
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
