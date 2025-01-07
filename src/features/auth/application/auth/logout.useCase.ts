import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../infrastructure/session.repository';

interface LogoutCommandPayload {
  userId: string;
  deviceId: string;
}

export class LogoutCommand {
  constructor(readonly payload: LogoutCommandPayload) {}
}

@CommandHandler(LogoutCommand)
export class LogoutCommandHandler implements ICommandHandler<LogoutCommand> {
  constructor(private sessionRepository: SessionRepository) {}

  public async execute({ payload }: LogoutCommand) {
    const [session] = await this.sessionRepository.findByField(
      'ownerId',
      payload.userId,
    );

    if (!session) return null;

    return this.sessionRepository.delete(session.id);
  }
}
