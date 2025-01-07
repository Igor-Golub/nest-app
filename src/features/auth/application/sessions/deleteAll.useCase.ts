import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../infrastructure/session.repository';

interface DeleteAllSessionsCommandPayload {
  userId: string;
  currentSessionVersion: string;
}

export class DeleteAllSessionsCommand {
  constructor(readonly payload: DeleteAllSessionsCommandPayload) {}
}

@CommandHandler(DeleteAllSessionsCommand)
export class DeleteAllSessionsCommandHandler
  implements ICommandHandler<DeleteAllSessionsCommand>
{
  constructor(private sessionRepository: SessionRepository) {}

  public async execute({ payload }: DeleteAllSessionsCommand): Promise<any> {
    const { userId, currentSessionVersion } = payload;

    const userSessions = await this.sessionRepository.findByField(
      'ownerId',
      userId,
    );

    const idsForDelete = this.defineSessionsIdsForDelete(
      userSessions,
      currentSessionVersion,
    );

    return this.sessionRepository.deleteAllSessions(userId, idsForDelete);
  }

  private defineSessionsIdsForDelete(
    userSessions,
    currentSessionVersion: string,
  ) {
    return userSessions
      .filter(({ version }) => String(version) !== currentSessionVersion)
      .map(({ _id }) => _id);
  }
}
