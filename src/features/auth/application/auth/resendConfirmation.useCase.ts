import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { NotifyManager } from '../../../../infrastructure/managers/notify.manager';
import { UsersService } from '../../../users/application';

export class ResendConfirmationCommand {
  constructor(readonly payload: any) {}
}

@CommandHandler(ResendConfirmationCommand)
export class ResendConfirmationHandler
  implements ICommandHandler<ResendConfirmationCommand>
{
  constructor(
    private readonly usersService: UsersService,
    private readonly notifyManager: NotifyManager,
  ) {}

  public async execute({ payload }: ResendConfirmationCommand) {
    const { email } = payload;

    const user = await this.usersService.findByEmail(email);

    if (!user) throw new BadRequestException('User not found');

    const { newCode } = await this.usersService.updateConfirmationCode(user.id);

    await this.notifyManager.sendRegistrationEmail({
      data: newCode,
      login: user!.login,
      email: payload.email,
    });

    return true;
  }
}
