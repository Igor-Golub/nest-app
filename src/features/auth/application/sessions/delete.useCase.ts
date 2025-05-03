import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../infrastructure/session.repository';

interface DeleteSessionCommandPayload {
  ownerId: string;
  deviceId: string;
}

export class DeleteSessionCommand {
  constructor(readonly payload: DeleteSessionCommandPayload) {}
}

@CommandHandler(DeleteSessionCommand)
export class DeleteSessionCommandHandler
  implements ICommandHandler<DeleteSessionCommand>
{
  constructor(private sessionRepository: SessionRepository) {}

  public async execute({ payload }: DeleteSessionCommand) {
    const { ownerId, deviceId } = payload;

    return await this.sessionRepository.deleteByDeviceIdAndOwnerId(
      deviceId,
      ownerId,
    );
  }
}
