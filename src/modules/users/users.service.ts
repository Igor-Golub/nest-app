import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/createUserDto';
import { UsersRepo } from './users.repo';
import { CryptoService } from '../../application/services/crypto/crypto.service';
import { add } from 'date-fns';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepo: UsersRepo,
    private readonly cryptoService: CryptoService,
  ) {}

  public async create(createUserDto: CreateUserDto) {
    const { _id, id, login, email } =
      // @ts-ignore
      await this.usersRepo.create(createUserDto);

    const newUser: ViewModels.User = {
      id,
      login,
      email,
      createdAt: _id._id.getTimestamp().toISOString(),
    };

    return newUser;
  }

  public async delete(id: string) {
    const result = await this.usersRepo.delete(id);

    if (!result) throw new NotFoundException();

    return true;
  }

  public async register(login: string, email: string, password: string) {
    const isUserWithTheSameLoginExist = await this.usersRepo.findByLogin(login);

    if (isUserWithTheSameLoginExist) {
      throw new BadRequestException('User with this login already exist');
    }

    const isUserWithTheSameEmailExist = await this.usersRepo.findByEmail(email);

    if (isUserWithTheSameEmailExist) {
      throw new BadRequestException('User with this email already exist');
    }

    const { hash } = await this.cryptoService.createSaltAndHash(password);

    const confirmationCode = uuidv4();

    await this.usersRepo.create({
      login,
      email,
      hash,
      confirmation: {
        isConfirmed: false,
        code: confirmationCode,
        expirationDate: add(new Date(), {
          minutes: 10,
        }),
      },
    });
  }
}
