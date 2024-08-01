import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionMongoRepo } from '../../infrastructure/mongo/session.mongo.repo';

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
  constructor(private sessionRepo: SessionMongoRepo) {}

  public async execute({ payload }: DeleteAllSessionsCommand): Promise<any> {
    const { userId, currentSessionVersion } = payload;

    const userSessions = await this.sessionRepo.findAllUserSessions(userId);

    const idsForDelete = this.defineSessionsIdsForDelete(
      userSessions,
      currentSessionVersion,
    );

    return this.sessionRepo.deleteAllSessions(userId, idsForDelete);
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
