import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UsersRepo } from '../infrastructure/users.repo';
import { CryptoService } from '../../../infrastructure/crypto/crypto.service';
import { add } from 'date-fns';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepo: UsersRepo,
    private readonly cryptoService: CryptoService,
  ) {}

  public async register({
    password,
    login,
    email,
  }: ServicesModels.RegisterUserInput) {
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

  public async confirmRegistration(code: string) {
    const user = await this.usersRepo.findByConfirmationCode(code);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepo.confirm(user._id);
  }

  public async passwordRecovery({ email }: ServicesModels.PasswordRecovery) {}

  public async confirmPasswordRecovery({
    recoveryCode,
    newPassword,
  }: ServicesModels.ConfirmPasswordRecovery) {}

  public async resendConfirmationRegistration({
    email,
  }: ServicesModels.ResendConfirmationRegistration) {}

  public async login({
    password,
    loginOrEmail,
  }: ServicesModels.LoginUserInput) {
    const user = await this.usersRepo.findByConfirmationCode(loginOrEmail);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const compareResult = this.cryptoService.compareCredential(
      password,
      user.hash,
    );

    if (!compareResult) {
      throw new NotFoundException('User not found');
    }
  }

  public async create(createUserDto: ServicesModels.CreateUserInput) {
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
}
