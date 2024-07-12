import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { CryptoService } from '../../../infrastructure/services/crypto.service';
import { UnauthorizedException } from '@nestjs/common';

export class LoginCommand {
  constructor(
    readonly payload: {
      userId: string;
      userHash: string;
      password: string;
    },
  ) {}
}

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
  ) {}

  public async execute({ payload }: LoginCommand) {
    const compareResult = this.cryptoService.compareCredential(
      payload.password,
      payload.userHash,
    );

    if (!compareResult) throw new UnauthorizedException();

    return {
      accessToken: await this.jwtService.signAsync({
        sub: payload.userId,
      }),
    };
  }
}
