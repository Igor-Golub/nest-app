import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepo } from '../infrastructure/users.repo';
import { CryptoService } from '../../../infrastructure/services/crypto.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepo: UsersRepo,
    private readonly cryptoService: CryptoService,
  ) {}

  public async create(createUserDto: ServicesModels.CreateUserInput) {
    const userByEmail = await this.usersRepo.findByEmail(createUserDto.email);

    if (userByEmail) {
      throw new NotFoundException('User already exist');
    }

    const userByLogin = await this.usersRepo.findByLogin(createUserDto.login);

    if (userByLogin) {
      throw new NotFoundException('User already exist');
    }

    const { hash } = await this.cryptoService.createSaltAndHash(
      createUserDto.password,
    );

    return this.usersRepo.create({
      accountData: {
        login: createUserDto.login,
        email: createUserDto.email,
        hash,
      },
      confirmation: {
        code: 'confirmed',
        isConfirmed: false,
        expirationDate: new Date(),
      },
    });
  }

  public async delete(id: string) {
    const result = await this.usersRepo.delete(id);

    if (!result) throw new NotFoundException();

    return true;
  }
}
