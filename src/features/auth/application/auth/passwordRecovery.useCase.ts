import { v4 as uuidv4 } from 'uuid';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { NotifyManager } from '../../../../infrastructure/managers/notify.manager';
import { UsersService } from '../../../users/application';
import { RecoveryStatuses } from '../../domain/recovery.entity';
import { add } from 'date-fns';
import { RecoveryRepository } from '../../infrastructure/recovery.repository';

export class PasswordRecoveryCommand {
  constructor(readonly payload: any) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryHandler implements ICommandHandler<PasswordRecoveryCommand> {
  constructor(
    private readonly usersService: UsersService,
    private readonly notifyManager: NotifyManager,
    private readonly recoveryRepository: RecoveryRepository,
  ) {}

  public async execute({ payload }: PasswordRecoveryCommand) {
    const { email } = payload;

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const recoveryCode = `${uuidv4()}_${user.id}`;

    await this.recoveryRepository.create({
      ownerId: user.id,
      code: recoveryCode,
      status: RecoveryStatuses.Created,
      expirationAt: add(new Date(), {
        minutes: 10,
      }),
    });

    await this.notifyManager.sendRecoveryEmail({
      email,
      login: user.login,
      data: recoveryCode,
    });
  }
}
