import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { UsersRepo } from '../../../users/infrastructure';
import { CryptoService } from '../../../../infrastructure/services/crypto.service';
import { NotifyManager } from '../../../../infrastructure/managers/notify.manager';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class RegisterCommand {
  constructor(readonly payload: ServicesModels.RegisterUserInput) {}
}

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    private readonly usersRepo: UsersRepo,
    private readonly cryptoService: CryptoService,
    private readonly notifyManager: NotifyManager,
  ) {}

  public async execute({ payload }: RegisterCommand) {
    const { email, login, password } = payload;

    const { hash } = await this.cryptoService.createSaltAndHash(password);

    const confirmationCode = uuidv4();

    await this.usersRepo.create({
      login,
      email,
      hash,
      isConfirmed: true,
    });

    this.notifyManager.sendRegistrationEmail({
      email,
      login,
      data: confirmationCode,
    });

    return true;
  }
}
