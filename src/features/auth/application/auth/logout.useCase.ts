import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../infrastructure/session.repository';

interface LogoutCommandPayload {
  ownerId: string;
  deviceId: string;
}

export class LogoutCommand {
  constructor(readonly payload: LogoutCommandPayload) {}
}

@CommandHandler(LogoutCommand)
export class LogoutCommandHandler implements ICommandHandler<LogoutCommand> {
  constructor(private sessionRepository: SessionRepository) {}

  public async execute({ payload }: LogoutCommand) {
    const session = await this.sessionRepository.findByDeviceIdAndOwnerId(
      payload.deviceId,
      payload.ownerId,
    );

    if (!session) throw new UnauthorizedException();

    return this.sessionRepository.delete(session.id);
  }
}
