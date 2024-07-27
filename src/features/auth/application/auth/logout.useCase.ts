import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepo } from '../../infrastructure/session.repo';

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
    return this.sessionRepo.deleteSessionByDeviceId(payload);
  }
}
