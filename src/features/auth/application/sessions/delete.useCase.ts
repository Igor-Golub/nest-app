import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionMongoRepo } from '../../infrastructure/mongo/session.mongo.repo';

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
  constructor(private sessionRepo: SessionMongoRepo) {}

  public async execute({ payload }: DeleteSessionCommand): Promise<any> {
    const { userId, deviceId } = payload;

    return await this.sessionRepo.deleteSessionByDeviceId({
      deviceId,
      userId,
    });
  }
}
