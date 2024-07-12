import { v4 as uuidv4 } from 'uuid';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { UsersRepo } from '../../users/infrastructure';
import { RecoveryRepo } from '../infrastructure/recovery.repo';
import { NotifyManager } from '../../../infrastructure/managers/notify.manager';

export class PasswordRecoveryCommand {
  constructor(readonly payload: ServicesModels.PasswordRecovery) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryHandler
  implements ICommandHandler<PasswordRecoveryCommand>
{
  constructor(
    private readonly recoveryRepo: RecoveryRepo,
    private readonly usersRepo: UsersRepo,
    private readonly notifyManager: NotifyManager,
  ) {}

  public async execute({ payload }: PasswordRecoveryCommand) {
    const user = await this.usersRepo.findByEmail(payload.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const recoveryCode = `${uuidv4()}_${user._id}`;

    await this.recoveryRepo.create(user._id, recoveryCode);

    await this.notifyManager.sendRecoveryEmail({
      email: payload.email,
      login: user.login,
      data: recoveryCode,
    });
  }
}
