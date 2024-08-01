import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionMongoRepo } from '../../infrastructure/mongo/session.mongo.repo';

interface LogoutCommandPayload {
  userId: string;
  deviceId: string;
}

export class LogoutCommand {
  constructor(readonly payload: LogoutCommandPayload) {}
}

@CommandHandler(LogoutCommand)
export class LogoutCommandHandler implements ICommandHandler<LogoutCommand> {
  constructor(private sessionRepo: SessionMongoRepo) {}

  public async execute({ payload }: LogoutCommand) {
    return this.sessionRepo.deleteSessionByDeviceId(payload);
  }
}
