import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { CryptoService } from '../../../infrastructure/services/crypto.service';
import { UsersService } from '../../users/application';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly cryptoService: CryptoService,
  ) {
    super({
      usernameField: 'loginOrEmail',
    });
  }

  public async validate(loginOrEmail: string, password: string) {
    const user = await this.usersService.findByLoginOrEmail(loginOrEmail);

    if (!user) throw new UnauthorizedException();

    const compareResult = this.cryptoService.compareCredential(
      password,
      user.hash,
    );

    if (!compareResult) {
      throw new UnauthorizedException();
    }

    return { id: user.id };
  }
}
