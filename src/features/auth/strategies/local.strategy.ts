import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersRepo } from '../../users/infrastructure/users.repo';
import { CryptoService } from '../../../infrastructure/services/crypto.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersRepo: UsersRepo,
    private readonly cryptoService: CryptoService,
  ) {
    super({
      usernameField: 'loginOrEmail',
    });
  }

  public async validate(loginOrEmail: string, password: string) {
    const user = await this.usersRepo.findByLoginOrEmail(loginOrEmail);

    if (!user) {
      throw new UnauthorizedException();
    }

    const compareResult = this.cryptoService.compareCredential(
      password,
      user.accountData.hash,
    );

    if (!compareResult) {
      throw new UnauthorizedException();
    }

    return user._id.toString();
  }
}
