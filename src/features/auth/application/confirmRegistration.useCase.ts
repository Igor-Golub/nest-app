import { isAfter } from 'date-fns';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { UsersRepo } from '../../users/infrastructure/users.repo';

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
      throw new NotFoundException('User not found');
    }

    if (user.confirmation.isConfirmed) {
      throw new NotFoundException('User already confirmed');
    }

    if (isAfter(new Date(), user.confirmation.expirationDate)) {
      throw new NotFoundException('Confirmation code expired');
    }

    await this.usersRepo.confirm(user._id);
  }
}
