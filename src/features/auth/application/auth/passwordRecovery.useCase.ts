import { v4 as uuidv4 } from 'uuid';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { UsersRepo } from '../../../users/infrastructure';
import { RecoveryPostgresRepo } from '../../infrastructure';
import { NotifyManager } from '../../../../infrastructure/managers/notify.manager';

export class PasswordRecoveryCommand {
  constructor(readonly payload: ServicesModels.PasswordRecovery) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryHandler
  implements ICommandHandler<PasswordRecoveryCommand>
{
  constructor(
    private readonly usersRepo: UsersRepo,
    private readonly notifyManager: NotifyManager,
    private readonly recoveryRepo: RecoveryPostgresRepo,
  ) {}

  public async execute({ payload }: PasswordRecoveryCommand) {
    const user = await this.usersRepo.findByField('email', payload.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const recoveryCode = `${uuidv4()}_${user.id}`;

    await this.recoveryRepo.create(user.id, recoveryCode);

    await this.notifyManager.sendRecoveryEmail({
      email: payload.email,
      login: user.login,
      data: recoveryCode,
    });
  }
}
