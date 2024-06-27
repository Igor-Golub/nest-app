import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { add, isAfter } from 'date-fns';
import { JwtService } from '@nestjs/jwt';
import { UsersRepo } from '../../users/infrastructure/users.repo';
import { CryptoService } from '../../../infrastructure/services/crypto.service';
import { RecoveryRepo } from '../infrastructure/recovery.repo';
import { NotifyManager } from '../../../infrastructure/managers/notify.manager';

// TODO:(class) add interlayer manager
@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UsersRepo,
    private readonly cryptoService: CryptoService,
    private readonly recoveryRepo: RecoveryRepo,
    private readonly notifyManager: NotifyManager,
    private readonly jwtService: JwtService,
  ) {}

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

    this.notifyManager.sendRegistrationEmail({
      email,
      login,
      data: confirmationCode,
    });

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

    const recoveryCode = `${uuidv4()}_${user._id}`;

    await this.recoveryRepo.create(user._id, recoveryCode);

    await this.notifyManager.sendRecoveryEmail({
      email,
      login: user.login,
      data: recoveryCode,
    });
  }

  public async confirmPasswordRecovery({
    recoveryCode,
    newPassword,
  }: ServicesModels.ConfirmPasswordRecovery) {
    const recovery = await this.recoveryRepo.getRecoveryByCode(recoveryCode);

    if (!recovery || isAfter(new Date(), recovery.expirationDate)) {
      throw new BadRequestException();
    }

    const { hash } = await this.cryptoService.createSaltAndHash(newPassword);

    await this.usersRepo.updateHash(recovery.userId, hash);
    await this.recoveryRepo.updateStatus(recovery._id, 'recovered');
  }

  public async resendConfirmation({
    email,
  }: ServicesModels.ResendConfirmation) {
    const user = await this.usersRepo.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.confirmation.isConfirmed) {
      throw new NotFoundException('User already confirmed');
    }

    const confirmationCode = `${uuidv4()}_${user._id}`;

    await this.usersRepo.updateConfirmationCode(user._id, confirmationCode);

    await this.notifyManager.sendNewConfirmationCodeToEmail({
      email,
      login: user!.login,
      data: confirmationCode,
    });
  }

  public async login(userId: string) {
    return {
      accessToken: await this.jwtService.signAsync({ sub: userId }),
    };
  }

  public async logout(refreshToken: string) {}
}
