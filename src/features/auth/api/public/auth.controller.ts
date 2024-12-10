import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Response } from 'express';
import {
  ConfirmPasswordRecoveryDto,
  ConfirmRegistrationDto,
  LoginDto,
  PasswordRecoveryDto,
  RegistrationDto,
  ResendConfirmationDto,
} from './models/input';
import { UsersQueryRepo } from '../../../users/infrastructure';
import {
  ConfirmPasswordRecoveryCommand,
  ConfirmRegistrationCommand,
  LoginCommand,
  PasswordRecoveryCommand,
  RegisterCommand,
  ResendConfirmationCommand,
} from '../../application/auth';
import { AuthViewMapperManager } from './mappers';
import { JwtAuthGuard, JwtCookieRefreshAuthGuard } from '../../guards';
import { RefreshTokenCommand } from '../../application/auth/refreshToken.useCase';
import { CookiesService } from '../../../../infrastructure/services/cookies.service';
import {
  CurrentDevice,
  CurrentSession,
  CurrentUserId,
} from '../../../../common/pipes';
import { LogoutCommand } from '../../application/auth';
import { SessionService } from '../../application/sessions/session.service';
import { UsersService } from '../../../users/application';

enum AuthRoutes {
  Me = '/me',
  Login = '/login',
  Logout = '/logout',
  NewPassword = '/new-password',
  Registration = '/registration',
  Refresh = '/refresh-token',
  PasswordRecovery = '/password-recovery',
  Confirmation = '/registration-confirmation',
  RegistrationEmailResending = '/registration-email-resending',
}

@Controller('auth')
export class AuthController {
  constructor(
    private commandBus: CommandBus,
    private userQueryRepo: UsersQueryRepo,
    private cookiesService: CookiesService,
    private sessionService: SessionService,
    private usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(AuthRoutes.Me)
  public async getProfile(@CurrentUserId() currentUserId: string) {
    const data = await this.userQueryRepo.findById(currentUserId);

    if (!data) throw new NotFoundException();

    return AuthViewMapperManager.mapProfileToView(data);
  }

  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @Post(AuthRoutes.Login)
  public async login(
    @Res({ passthrough: true }) response: Response,
    @Body() { loginOrEmail, password }: LoginDto,
    @CurrentDevice() { deviceIp, deviceName },
  ) {
    const user = await this.userQueryRepo.findByFields(
      ['login', 'email'],
      loginOrEmail,
    );

    if (!user) throw new UnauthorizedException();

    const command = new LoginCommand({
      deviceData: { ip: deviceIp, name: deviceName },
      userData: { password, hash: user.hash, id: user.id },
    });

    const { refresh, access } = await this.commandBus.execute(command);

    this.cookiesService.write(response, 'refreshToken', refresh);
    this.cookiesService.write(response, 'accessToken', access);

    return { accessToken: access };
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

    const user = await this.userQueryRepo.findByField('email', email);

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
  @UseGuards(JwtCookieRefreshAuthGuard)
  @Post(AuthRoutes.Refresh)
  @HttpCode(HttpStatus.OK)
  public async refreshToken(
    @Res({ passthrough: true }) response: Response,
    @CurrentSession() { refreshToken }: Base.Session,
  ) {
    const { session } = await this.sessionService.isSessionExist(refreshToken);

    await this.usersService.isUserExist(session.ownerId, 'unauthorized');

    await this.sessionService.isSessionOfCurrentUser(
      session.ownerId,
      session.deviceId,
    );

    const command = new RefreshTokenCommand({
      userId: session.ownerId,
      deviceId: session.deviceId,
      sessionId: session.id,
    });

    const { refresh, access } = await this.commandBus.execute(command);

    this.cookiesService.write(response, 'refreshToken', refresh);
    this.cookiesService.write(response, 'accessToken', access);

    return { accessToken: access };
  }

  @Post(AuthRoutes.Logout)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtCookieRefreshAuthGuard)
  public async logout(
    @CurrentSession() { id: userId, deviceId, refreshToken }: Base.Session,
  ) {
    await this.sessionService.isSessionExist(refreshToken);

    const command = new LogoutCommand({
      deviceId,
      userId,
    });

    await this.commandBus.execute(command);
  }
}
