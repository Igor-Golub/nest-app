import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { add, isAfter } from 'date-fns';
import { UsersRepo } from '../../users/infrastructure/users.repo';
import { CryptoService } from '../../../infrastructure/crypto/crypto.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UsersRepo,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
  ) {}

  // TODO:(method) add interlayer manager
  public async register({
    login,
    email,
    password,
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

    // TODO:(main) Add send email to user with code!

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

  // TODO:(method) add interlayer manager
  public async confirmRegistration(code: string) {
    const user = await this.usersRepo.findByConfirmationCode(code);

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

  public async passwordRecovery({ email }: ServicesModels.PasswordRecovery) {
    const user = await this.usersRepo.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const recoveryCode = uuidv4();
  }

  public async confirmPasswordRecovery({
    recoveryCode,
    newPassword,
  }: ServicesModels.ConfirmPasswordRecovery) {}

  public async resendConfirmation({
    email,
  }: ServicesModels.ResendConfirmation) {}

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
}
