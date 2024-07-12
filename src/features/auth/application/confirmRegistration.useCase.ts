import { isAfter } from 'date-fns';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { UsersRepo } from '../../users/infrastructure';

export class ConfirmRegistrationCommand {
  constructor(readonly payload: { code: string }) {}
}

@CommandHandler(ConfirmRegistrationCommand)
export class ConfirmRegistrationHandler
  implements ICommandHandler<ConfirmRegistrationCommand>
{
  constructor(private readonly usersRepo: UsersRepo) {}

  public async execute({ payload }: ConfirmRegistrationCommand) {
    const user = await this.usersRepo.findByConfirmationCode(payload.code);

    if (!user) {
      throw new BadRequestException([
        {
          message: 'User not found',
          field: 'code',
        },
      ]);
    }

    if (user.confirmation.isConfirmed) {
      throw new BadRequestException([
        {
          message: 'User already confirmed',
          field: 'code',
        },
      ]);
    }

    if (isAfter(new Date(), user.confirmation.expirationDate)) {
      throw new BadRequestException([
        {
          message: 'Confirmation code expired',
          field: 'code',
        },
      ]);
    }

    await this.usersRepo.confirm(user._id);
  }
}
