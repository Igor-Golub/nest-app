import { v4 as uuidv4 } from 'uuid';
import { NotifyManager } from '../../../../infrastructure/managers/notify.manager';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from '../../../users/application';

export class RegisterCommand {
  constructor(readonly payload: ServicesModels.RegisterUserInput) {}
}

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    private readonly usersService: UsersService,
    private readonly notifyManager: NotifyManager,
  ) {}

  public async execute({ payload }: RegisterCommand) {
    const { email, login } = payload;

    const confirmationCode = uuidv4();

    await this.usersService.create({ ...payload, isConfirmed: false });

    this.notifyManager.sendRegistrationEmail({
      email,
      login,
      data: confirmationCode,
    });

    return true;
  }
}
