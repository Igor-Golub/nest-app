import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async getTokens(
    userId: string,
  ): Promise<{ access: string; refresh: string }> {
    const jwtPayload = { sub: userId };

    const [access, refresh] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('auth.jwtSecret'),
        expiresIn: this.config.get<string>('auth.jwtExpireTime'),
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('jwtRefreshSecret'),
        expiresIn: this.config.get<string>('jwtRefreshExpireTime'),
      }),
    ]);

    return { access, refresh };
  }
}
