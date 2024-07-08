import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Response } from 'express';
import {
  LoginDto,
  PasswordRecoveryDto,
  ConfirmPasswordRecoveryDto,
  ConfirmRegistrationDto,
  RegistrationDto,
  ResendConfirmationDto,
} from './models/input';
import { UsersQueryRepo } from '../../users/infrastructure/';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { CurrentUserId } from '../../../common/pipes/current.userId';
import {
  RegisterCommand,
  LoginCommand,
  ResendConfirmationCommand,
  ConfirmRegistrationCommand,
  ConfirmPasswordRecoveryCommand,
  PasswordRecoveryCommand,
} from '../application';

enum AuthRoutes {
  Me = '/me',
  Login = '/login',
  NewPassword = '/new-password',
  Registration = '/registration',
  PasswordRecovery = '/password-recovery',
  Confirmation = '/registration-confirmation',
  RegistrationEmailResending = '/registration-email-resending',
}

// TODO:(main) Добавить функциональность определения выбрасываемого эксепшена
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

  @UseGuards(ThrottlerGuard)
  @UseGuards(LocalAuthGuard)
  @Post(AuthRoutes.Login)
  public async login(
    @Res({ passthrough: true }) response: Response,
    @CurrentUserId() currentUserId: string,
    @Body() loginDto: LoginDto,
  ) {
    const command = new LoginCommand({ userId: currentUserId });

    const result = await this.commandBus.execute(command);

    // TODO create cookies service
    response.cookie('authToken', result.accessToken, {
      httpOnly: true,
      secure: true,
    });

    return result;
  }

  @UseGuards(ThrottlerGuard)
  @Post(AuthRoutes.PasswordRecovery)
  public async recoveryPassword(
    @Body() passwordRecoveryDto: PasswordRecoveryDto,
  ) {
    const command = new PasswordRecoveryCommand(passwordRecoveryDto);

    return this.commandBus.execute(command);
  }

  @UseGuards(ThrottlerGuard)
  @Post(AuthRoutes.NewPassword)
  public async confirmPasswordRecovery(
    @Body() confirmPasswordRecoveryDto: ConfirmPasswordRecoveryDto,
  ) {
    const command = new ConfirmPasswordRecoveryCommand(
      confirmPasswordRecoveryDto,
    );

    return this.commandBus.execute(command);
  }

  @UseGuards(ThrottlerGuard)
  @Post(AuthRoutes.Confirmation)
  public async confirmRegistration(
    @Body() confirmRegistrationDto: ConfirmRegistrationDto,
  ) {
    const command = new ConfirmRegistrationCommand(confirmRegistrationDto);

    return this.commandBus.execute(command);
  }

  @UseGuards(ThrottlerGuard)
  @Post(AuthRoutes.Registration)
  @HttpCode(HttpStatus.CREATED)
  public async registration(@Body() registrationDto: RegistrationDto) {
    const command = new RegisterCommand(registrationDto);

    return this.commandBus.execute(command);
  }

  @UseGuards(ThrottlerGuard)
  @Post(AuthRoutes.RegistrationEmailResending)
  public async resendConfirmation(
    @Body() resendConfirmation: ResendConfirmationDto,
  ) {
    const command = new ResendConfirmationCommand(resendConfirmation);

    return this.commandBus.execute(command);
  }
}
