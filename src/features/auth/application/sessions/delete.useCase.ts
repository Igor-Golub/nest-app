import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepo } from '../../infrastructure/session.repo';

interface DeleteSessionCommandPayload {
  userId: string;
  deviceId: string;
}

export class DeleteSessionCommand {
  constructor(readonly payload: DeleteSessionCommandPayload) {}
}

@CommandHandler(DeleteSessionCommand)
export class DeleteSessionCommandHandler
  implements ICommandHandler<DeleteSessionCommand>
{
  constructor(private sessionRepo: SessionRepo) {}

  public async execute({ payload }: DeleteSessionCommand): Promise<any> {
    const { userId, deviceId } = payload;

    return await this.sessionRepo.deleteSessionByDeviceId({
      deviceId,
      userId,
    });
  }
}
