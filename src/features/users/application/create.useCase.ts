import { UsersRepo } from '../infrastructure';
import { CryptoService } from '../../../infrastructure/services/crypto.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

interface CreateUserCommandPayload {
  login: string;
  email: string;
  password: string;
}

export class CreateUserCommand {
  constructor(readonly payload: CreateUserCommandPayload) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private usersRepo: UsersRepo,
    private cryptoService: CryptoService,
  ) {}

  public async execute({ payload }: CreateUserCommand) {
    const { email, login, password } = payload;

    const { hash } = await this.cryptoService.createSaltAndHash(password);

    return this.usersRepo.create({
      hash,
      login,
      email,
      isConfirmed: false,
    });
  }
}
