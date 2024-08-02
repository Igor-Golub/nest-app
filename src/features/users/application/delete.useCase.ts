import { UsersRepo } from '../infrastructure';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

interface DeleteUserCommandPayload {
  id: string;
}

export class DeleteUserCommand {
  constructor(readonly payload: DeleteUserCommandPayload) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(private usersRepo: UsersRepo) {}

  public async execute({ payload }: DeleteUserCommand) {
    const { id } = payload;

    return this.usersRepo.delete(id);
  }
}
