import { Injectable } from '@nestjs/common';
import { UsersRepo } from '../infrastructure/users.repo';
import { CryptoService } from '@app/infrastructure/services/crypto.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepo: UsersRepo,
    private readonly cryptoService: CryptoService,
  ) {}

  public async create(createUserDto: ServicesModels.CreateUserInput) {
    const { hash } = await this.cryptoService.createSaltAndHash(
      createUserDto.password,
    );

    const { _id } = await this.usersRepo.create({
      login: createUserDto.login,
      email: createUserDto.email,
      hash,
      confirmation: {
        code: 'confirmed',
        isConfirmed: false,
        expirationDate: new Date(),
      },
    });

    return {
      email: createUserDto.email,
      login: createUserDto.login,
      id: _id.toString(),
      createdAt: _id.getTimestamp().toISOString(),
    };
  }

  public async delete(id: string) {
    return this.usersRepo.delete(id);
  }
}
