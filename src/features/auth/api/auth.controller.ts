import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './models/input/loginDto';
import { PasswordRecoveryDto } from './models/input/passwordRecoveryDto';
import { ConfirmPasswordRecoveryDto } from './models/input/confirmPasswordRecoveryDto';
import { ConfirmRegistrationDto } from './models/input/confirmRegistrationDto';
import { RegistrationDto } from './models/input/registrationDto';
import { ResendConfirmationDto } from './models/input/resendConfirmationDto';
import { UsersQueryRepo } from '../../users/infrastructure/users.query.repo';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { CurrentUserId } from '../../../common/pipes/current.userId';
import { RegisterCommand } from '../application/register.useCase';
import { CommandBus } from '@nestjs/cqrs';
import { LoginCommand } from '../application/login.useCase';
import { ResendConfirmationCommand } from '../application/resendConfirmation.useCase';
import { ConfirmRegistrationCommand } from '../application/confirmRegistration.useCase';
import { ConfirmPasswordRecoveryCommand } from '../application/confirmPasswordRecovery.useCase';
import { PasswordRecoveryCommand } from '../application/passwordRecovery.useCase';

enum AuthRoutes {
  Me = '/me',
  Login = '/login',
  NewPassword = '/new-password',
  Registration = '/registration',
  PasswordRecovery = '/password-recovery',
  Confirmation = '/registration-confirmation',
  RegistrationEmailResending = '/registration-email-resending',
}

// TODO:(main) add rete limited to some endpoints and metainfo
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly userQueryRepo: UsersQueryRepo,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(AuthRoutes.Me)
  public async getProfile(@CurrentUserId() currentUserId: string) {
    return this.userQueryRepo.getProfile(currentUserId);
  }

  @UseGuards(LocalAuthGuard)
  @Post(AuthRoutes.Login)
  public async login(
    @CurrentUserId() currentUserId: string,
    @Body() loginDto: LoginDto,
  ) {
    const command = new LoginCommand({ userId: currentUserId });

    return this.commandBus.execute(command);
  }

  @Post(AuthRoutes.PasswordRecovery)
  public async recoveryPassword(
    @Body() passwordRecoveryDto: PasswordRecoveryDto,
  ) {
    const command = new PasswordRecoveryCommand(passwordRecoveryDto);

    return this.commandBus.execute(command);
  }

  @Post(AuthRoutes.NewPassword)
  public async confirmPasswordRecovery(
    @Body() confirmPasswordRecoveryDto: ConfirmPasswordRecoveryDto,
  ) {
    const command = new ConfirmPasswordRecoveryCommand(
      confirmPasswordRecoveryDto,
    );

    return this.commandBus.execute(command);
  }

  @Post(AuthRoutes.Confirmation)
  public async confirmRegistration(
    @Body() confirmRegistrationDto: ConfirmRegistrationDto,
  ) {
    const command = new ConfirmRegistrationCommand(confirmRegistrationDto);

    return this.commandBus.execute(command);
  }

  @Post(AuthRoutes.Registration)
  @HttpCode(HttpStatus.CREATED)
  public async registration(@Body() registrationDto: RegistrationDto) {
    const command = new RegisterCommand(registrationDto);

    return this.commandBus.execute(command);
  }

  @Post(AuthRoutes.RegistrationEmailResending)
  public async resendConfirmation(
    @Body() resendConfirmation: ResendConfirmationDto,
  ) {
    const command = new ResendConfirmationCommand(resendConfirmation);

    return this.commandBus.execute(command);
  }
}
