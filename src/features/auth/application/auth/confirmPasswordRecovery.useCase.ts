import { isAfter } from 'date-fns';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RecoveryRepo } from '../../infrastructure';
import { UsersService } from '../../../users/application';
import { RecoveryStatuses } from '../../domain/recoveryEntity';
import { CryptoService } from '../../../../infrastructure/services/crypto.service';

export class ConfirmPasswordRecoveryCommand {
  constructor(readonly payload: ServicesModels.ConfirmPasswordRecovery) {}
}

@CommandHandler(ConfirmPasswordRecoveryCommand)
export class ConfirmPasswordRecoveryHandler
  implements ICommandHandler<ConfirmPasswordRecoveryCommand>
{
  constructor(
    private readonly usersService: UsersService,
    private readonly cryptoService: CryptoService,
    private readonly recoveryRepo: RecoveryRepo,
  ) {}

  public async execute({ payload }: ConfirmPasswordRecoveryCommand) {
    const recovery = await this.recoveryRepo.findByField(
      'code',
      payload.recoveryCode,
    );

    if (!recovery || isAfter(new Date(), recovery.expirationAt)) {
      throw new BadRequestException([
        {
          field: 'code',
          message: 'Bad request',
        },
      ]);
    }

    const { hash } = await this.cryptoService.createSaltAndHash(
      payload.newPassword,
    );

    await this.usersService.updateHash(recovery.ownerId, hash);
    await this.recoveryRepo.updateField(
      recovery.id,
      'status',
      RecoveryStatuses.Success,
    );
  }
}
