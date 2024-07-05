import { UsersRepo } from '../infrastructure/users.repo';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class DeleteUserCommand {
  constructor(readonly payload: { id: string }) {}
}

@CommandHandler(DeleteUserCommand)
export class UsersService implements ICommandHandler<DeleteUserCommand> {
  constructor(private readonly usersRepo: UsersRepo) {}

  public async execute({ payload: { id } }: DeleteUserCommand) {
    return this.usersRepo.delete(id);
  }
}
