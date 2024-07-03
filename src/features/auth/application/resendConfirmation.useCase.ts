import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { NotifyManager } from '../../../infrastructure/managers/notify.manager';
import { UsersRepo } from '../../users/infrastructure/users.repo';

export class ResendConfirmationCommand {
  constructor(readonly payload: ServicesModels.ResendConfirmation) {}
}

@CommandHandler(ResendConfirmationCommand)
export class ResendConfirmationHandler
  implements ICommandHandler<ResendConfirmationCommand>
{
  constructor(
    private readonly usersRepo: UsersRepo,
    private readonly notifyManager: NotifyManager,
  ) {}

  public async execute({ payload }: ResendConfirmationCommand) {
    const user = await this.usersRepo.findByEmail(payload.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.confirmation.isConfirmed) {
      throw new NotFoundException('User already confirmed');
    }

    const confirmationCode = `${uuidv4()}_${user._id}`;

    await this.usersRepo.updateConfirmationCode(user._id, confirmationCode);

    await this.notifyManager.sendNewConfirmationCodeToEmail({
      login: user!.login,
      email: payload.email,
      data: confirmationCode,
    });
  }
}
