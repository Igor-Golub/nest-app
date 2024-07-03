import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';

export class LoginCommand {
  constructor(readonly payload: { userId: string }) {}
}

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(private readonly jwtService: JwtService) {}

  public async execute({ payload }: LoginCommand) {
    return {
      accessToken: await this.jwtService.signAsync({ sub: payload.userId }),
    };
  }
}
