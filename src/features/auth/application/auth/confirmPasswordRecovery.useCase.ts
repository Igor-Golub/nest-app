import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { isAfter } from 'date-fns';
import { CryptoService } from '../../../../infrastructure/services/crypto.service';
import { RecoveryMongoRepo } from '../../infrastructure';
import { UsersService } from '../../../users/application';

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
    private readonly recoveryRepo: RecoveryMongoRepo,
  ) {}

  public async execute({ payload }: ConfirmPasswordRecoveryCommand) {
    const recovery = await this.recoveryRepo.getRecoveryByCode(
      payload.recoveryCode,
    );

    if (!recovery || isAfter(new Date(), recovery.expirationDate)) {
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

    await this.usersService.updateHash(recovery.userId, hash);
    await this.recoveryRepo.updateStatus(recovery._id, 'recovered');
  }
}
