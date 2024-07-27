import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepo } from '../../infrastructure/session.repo';

interface DeleteAllSessionsCommandPayload {
  userId: string;
  currentSessionId: string;
}

export class DeleteAllSessionsCommand {
  constructor(readonly payload: DeleteAllSessionsCommandPayload) {}
}

@CommandHandler(DeleteAllSessionsCommand)
export class DeleteAllSessionsCommandHandler
  implements ICommandHandler<DeleteAllSessionsCommand>
{
  constructor(private sessionRepo: SessionRepo) {}

  public async execute({ payload }: DeleteAllSessionsCommand): Promise<any> {
    const { userId, currentSessionId } = payload;

    const userSessions = await this.sessionRepo.findAllUserSessions(userId);

    const idsForDelete = this.defineSessionsIdsForDelete(
      userSessions,
      currentSessionId,
    );

    return this.sessionRepo.deleteAllSessions(userId, idsForDelete);
  }

  private defineSessionsIdsForDelete(userSessions, currentSessionId: string) {
    return userSessions
      .filter(({ version }) => String(version) !== currentSessionId)
      .map(({ _id }) => _id);
  }
}
