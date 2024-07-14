import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request, Response } from 'express';
import {
  ConfirmPasswordRecoveryDto,
  ConfirmRegistrationDto,
  LoginDto,
  PasswordRecoveryDto,
  RegistrationDto,
  ResendConfirmationDto,
} from './models/input';
import { UsersQueryRepo } from '../../users/infrastructure/';
import { CurrentUserId } from '../../../common/pipes/current.userId';
import {
  ConfirmPasswordRecoveryCommand,
  ConfirmRegistrationCommand,
  LoginCommand,
  PasswordRecoveryCommand,
  RegisterCommand,
  ResendConfirmationCommand,
} from '../application';
import { mapProfileToView } from './mappers';
import { JwtAuthGuard, JwtRefreshAuthGuard } from '../guards';
import { RefreshTokenCommand } from '../application/refreshToken.useCase';

enum AuthRoutes {
  Me = '/me',
  Login = '/login',
  NewPassword = '/new-password',
  Registration = '/registration',
  Refresh = '/refresh-token',
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
    const data = await this.userQueryRepo.getProfile(currentUserId);

    if (!data) throw new NotFoundException();

    return mapProfileToView(data);
  }

  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @Post(AuthRoutes.Login)
  public async login(
    @Res({ passthrough: true }) response: Response,
    @Body() { loginOrEmail, password }: LoginDto,
  ) {
    const user = await this.userQueryRepo.getByEmailOrLogin(loginOrEmail);

    if (!user) throw new UnauthorizedException();

    const command = new LoginCommand({
      password,
      userHash: user.hash,
      userId: user._id.toString(),
    });

    const result = await this.commandBus.execute(command);

    // TODO create cookies service
    response.cookie('authToken', result.accessToken, {
      httpOnly: true,
      secure: true,
    });

    response.cookie('refreshToken', 'mock');

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

    return await this.commandBus.execute(command);
  }

  @UseGuards(ThrottlerGuard)
  @Post(AuthRoutes.Confirmation)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async confirmRegistration(
    @Body() confirmRegistrationDto: ConfirmRegistrationDto,
  ) {
    const command = new ConfirmRegistrationCommand(confirmRegistrationDto);

    return await this.commandBus.execute(command);
  }

  @UseGuards(ThrottlerGuard)
  @Post(AuthRoutes.Registration)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async registration(@Body() registrationDto: RegistrationDto) {
    const command = new RegisterCommand(registrationDto);

    return await this.commandBus.execute(command);
  }

  @UseGuards(ThrottlerGuard)
  @Post(AuthRoutes.RegistrationEmailResending)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async resendConfirmation(
    @Body() resendConfirmation: ResendConfirmationDto,
  ) {
    const { email } = resendConfirmation;

    const user = await this.userQueryRepo.getByEmail(email);

    if (!user)
      throw new BadRequestException([
        {
          field: 'email',
          message: 'Email not found',
        },
      ]);

    const command = new ResendConfirmationCommand(resendConfirmation);

    return await this.commandBus.execute(command);
  }

  @UseGuards(ThrottlerGuard)
  @Post(AuthRoutes.Refresh)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshAuthGuard)
  public async refreshToken(
    @Req() request: Request,
    @CurrentUserId() currentUserId: string,
  ) {
    const refreshToken = request.cookies['refreshToken'];
    const user = await this.userQueryRepo.getById(currentUserId);

    if (!refreshToken || !user) throw new UnauthorizedException();

    const command = new RefreshTokenCommand({
      userId: currentUserId,
      refreshToken,
    });

    return await this.commandBus.execute(command);
  }
}
