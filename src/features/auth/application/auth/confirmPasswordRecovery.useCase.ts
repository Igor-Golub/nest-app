import { isAfter } from 'date-fns';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from '../../../users/application';
import { RecoveryStatuses } from '../../domain/recovery.entity';
import { CryptoService } from '../../../../infrastructure/services/crypto.service';
import { RecoveryRepository } from '../../infrastructure/recovery.repository';

interface ConfirmPasswordRecoveryPayload {
  newPassword: string;
  recoveryCode: string;
}

export class ConfirmPasswordRecoveryCommand {
  constructor(readonly payload: ConfirmPasswordRecoveryPayload) {}
}

@CommandHandler(ConfirmPasswordRecoveryCommand)
export class ConfirmPasswordRecoveryHandler implements ICommandHandler<ConfirmPasswordRecoveryCommand> {
  constructor(
    private readonly usersService: UsersService,
    private readonly cryptoService: CryptoService,
    private readonly recoveryRepository: RecoveryRepository,
  ) {}

  public async execute({ payload }: ConfirmPasswordRecoveryCommand) {
    const recovery = await this.recoveryRepository.findByField('code', payload.recoveryCode);

    if (!recovery || isAfter(new Date(), recovery.expirationAt)) {
      throw new BadRequestException([
        {
          field: 'code',
          message: 'Bad request',
        },
      ]);
    }

    const { hash } = await this.cryptoService.createSaltAndHash(payload.newPassword);

    await this.usersService.updateHash(recovery.ownerId, hash);
    await this.recoveryRepository.updateField(recovery.id, 'status', RecoveryStatuses.Success);
  }
}
