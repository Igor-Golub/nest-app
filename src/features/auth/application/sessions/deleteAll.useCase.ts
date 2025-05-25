import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../infrastructure/session.repository';
import { Session } from '../../domain/session.entity';

interface DeleteAllSessionsCommandPayload {
  ownerId: string;
  currentSessionVersion: string;
}

export class DeleteAllSessionsCommand {
  constructor(readonly payload: DeleteAllSessionsCommandPayload) {}
}

@CommandHandler(DeleteAllSessionsCommand)
export class DeleteAllSessionsCommandHandler implements ICommandHandler<DeleteAllSessionsCommand> {
  constructor(private sessionRepository: SessionRepository) {}

  public async execute({ payload }: DeleteAllSessionsCommand) {
    const { ownerId, currentSessionVersion } = payload;

    const userSessions = await this.sessionRepository.findByField('ownerId', ownerId);

    const idsForDelete = this.defineSessionsIdsForDelete(userSessions, currentSessionVersion);

    return this.sessionRepository.deleteAllSessions(ownerId, idsForDelete);
  }

  private defineSessionsIdsForDelete(userSessions: Session[], currentSessionVersion: string) {
    return userSessions.filter(({ version }) => version !== currentSessionVersion).map(({ id }) => id);
  }
}
