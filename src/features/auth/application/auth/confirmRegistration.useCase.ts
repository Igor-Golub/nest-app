import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from '../../../users/application';

interface ConfirmRegistrationCommandPayload {
  code: string;
}

export class ConfirmRegistrationCommand {
  constructor(readonly payload: ConfirmRegistrationCommandPayload) {}
}

@CommandHandler(ConfirmRegistrationCommand)
export class ConfirmRegistrationHandler
  implements ICommandHandler<ConfirmRegistrationCommand>
{
  constructor(private usersService: UsersService) {}

  public async execute({ payload }: ConfirmRegistrationCommand) {
    const { code } = payload;

    await this.usersService.confirmUser(code);
  }
}
