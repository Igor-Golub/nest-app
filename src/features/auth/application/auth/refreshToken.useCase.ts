import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from './auth.service';
import { SessionRepo } from '../../infrastructure';

interface RefreshTokenCommandPayload {
  userId: string;
  deviceId: string;
  sessionId: string;
}

export class RefreshTokenCommand {
  constructor(readonly payload: RefreshTokenCommandPayload) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    private authService: AuthService,
    private sessionRepo: SessionRepo,
  ) {}

  public async execute({ payload }: RefreshTokenCommand) {
    const { userId, deviceId, sessionId } = payload;

    const tokensPairs = await this.authService.generateTokens(userId, deviceId);

    const result = this.authService.getSessionVersionAndExpirationDate(
      tokensPairs.refresh,
    );

    await this.sessionRepo.updateField(sessionId, 'version', result.version);
    await this.sessionRepo.updateField(
      sessionId,
      'expirationDate',
      result.expirationDate,
    );

    return tokensPairs;
  }
}
