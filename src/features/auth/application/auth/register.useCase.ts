import { NotifyManager } from '../../../../infrastructure/managers/notify.manager';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from '../../../users/application';

interface RegisterCommandPayload {
  login: string;
  email: string;
  password: string;
}

export class RegisterCommand {
  constructor(readonly payload: RegisterCommandPayload) {}
}

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    private readonly usersService: UsersService,
    private readonly notifyManager: NotifyManager,
  ) {}

  public async execute({ payload }: RegisterCommand): Promise<void> {
    const { email, login } = payload;

    const { confirmationCode } = await this.usersService.create({
      ...payload,
      isConfirmed: false,
    });

    if (confirmationCode) {
      this.notifyManager.sendRegistrationEmail({
        email,
        login,
        data: confirmationCode,
      });
    }
  }
}
