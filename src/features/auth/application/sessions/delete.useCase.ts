import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../infrastructure/session.repository';

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
  constructor(private sessionRepository: SessionRepository) {}

  public async execute({ payload }: DeleteSessionCommand): Promise<any> {
    const { userId, deviceId } = payload;

    return await this.sessionRepository.deleteByFields({
      deviceId,
      userId,
    });
  }
}
