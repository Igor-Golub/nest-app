import { UsersRepo } from '../infrastructure/users.repo';
import { CryptoService } from '../../../infrastructure/services/crypto.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CreateUserCommand {
  constructor(readonly payload: ServicesModels.CreateUserInput) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly usersRepo: UsersRepo,
    private readonly cryptoService: CryptoService,
  ) {}

  public async execute({ payload }: CreateUserCommand) {
    const { hash } = await this.cryptoService.createSaltAndHash(
      payload.password,
    );

    const { _id } = await this.usersRepo.create({
      login: payload.login,
      email: payload.email,
      hash,
      confirmation: {
        code: 'confirmed',
        isConfirmed: false,
        expirationDate: new Date(),
      },
    });

    return {
      email: payload.email,
      login: payload.login,
      id: _id.toString(),
      createdAt: _id.getTimestamp().toISOString(),
    };
  }
}
