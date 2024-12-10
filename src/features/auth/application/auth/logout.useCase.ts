import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepo } from '../../infrastructure';

interface LogoutCommandPayload {
  userId: string;
  deviceId: string;
}

export class LogoutCommand {
  constructor(readonly payload: LogoutCommandPayload) {}
}

@CommandHandler(LogoutCommand)
export class LogoutCommandHandler implements ICommandHandler<LogoutCommand> {
  constructor(private sessionRepo: SessionRepo) {}

  public async execute({ payload }: LogoutCommand) {
    const [session] = await this.sessionRepo.findByField(
      'ownerId',
      payload.userId,
    );

    if (!session) return null;

    return this.sessionRepo.delete(session.id);
  }
}
