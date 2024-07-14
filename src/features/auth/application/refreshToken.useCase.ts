import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from './auth.service';

export class RefreshTokenCommand {
  constructor(
    readonly payload: {
      userId: string;
      refreshToken: string;
    },
  ) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(private readonly authService: AuthService) {}

  public async execute({ payload }: RefreshTokenCommand) {
    const { userId, refreshToken } = payload;

    return await this.authService.getTokens(userId);
  }
}
