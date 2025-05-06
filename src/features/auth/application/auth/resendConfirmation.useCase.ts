import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { NotifyManager } from '../../../../infrastructure/managers/notify.manager';
import { UsersService } from '../../../users/application';

interface ResendConfirmationPayload {
  email: string;
}

export class ResendConfirmationCommand {
  constructor(readonly payload: ResendConfirmationPayload) {}
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
    const user = await this.usersService.findByEmail(payload.email);

    if (!user) throw new BadRequestException('User not found');

    const { newCode } = await this.usersService.updateConfirmationCode(user.id);

    await this.notifyManager.resendConfirmationCodeEmail({
      data: newCode,
      login: user!.login,
      email: payload.email,
    });

    return true;
  }
}
