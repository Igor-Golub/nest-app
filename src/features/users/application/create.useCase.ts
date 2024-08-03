import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from './users.service';

interface CreateUserCommandPayload {
  login: string;
  email: string;
  password: string;
}

export class CreateUserCommand {
  constructor(readonly payload: CreateUserCommandPayload) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private usersService: UsersService) {}

  public async execute({ payload }: CreateUserCommand) {
    return this.usersService.create({ ...payload, isConfirmed: true });
  }
}
