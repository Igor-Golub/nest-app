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
import { UsersQueryRepo } from '../../users/infrastructure/';
import {
  ConfirmPasswordRecoveryCommand,
  ConfirmRegistrationCommand,
  LoginCommand,
  PasswordRecoveryCommand,
  RegisterCommand,
  ResendConfirmationCommand,
} from '../application';
import { AuthViewMapperManager } from './mappers';
import { JwtAuthGuard, JwtCookieRefreshAuthGuard } from '../guards';
import { RefreshTokenCommand } from '../application/refreshToken.useCase';
import { CookiesService } from '../../../infrastructure/services/cookies.service';
import {
  CurrentDevice,
  CurrentSession,
  CurrentUserId,
} from '../../../common/pipes';
import { AuthService } from '../application/auth.service';
import { SessionRepo } from '../infrastructure/session.repo';

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

@Controller('auth')
export class AuthController {
  constructor(
    private commandBus: CommandBus,
    private authService: AuthService,
    private userQueryRepo: UsersQueryRepo,
    private cookiesService: CookiesService,
    private sessionRepo: SessionRepo,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(AuthRoutes.Me)
  public async getProfile(@CurrentUserId() currentUserId: string) {
    const data = await this.userQueryRepo.getProfile(currentUserId);

    if (!data) throw new NotFoundException();

    return AuthViewMapperManager.mapProfileToView(data);
  }

  @HttpCode(HttpStatus.OK)
  @Post(AuthRoutes.Login)
  public async login(
    @Res({ passthrough: true }) response: Response,
    @Body() { loginOrEmail, password }: LoginDto,
    @CurrentDevice() { deviceIp, deviceName },
  ) {
    const user = await this.userQueryRepo.getByEmailOrLogin(loginOrEmail);

    if (!user) throw new UnauthorizedException();

    const command = new LoginCommand({
      deviceData: { ip: deviceIp, name: deviceName },
      userData: { password, hash: user.hash, id: user._id.toString() },
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
  @UseGuards(JwtCookieRefreshAuthGuard)
  public async refreshToken(
    @Res({ passthrough: true }) response: Response,
    @CurrentSession() { id: userId, deviceId, refreshToken }: Base.Session,
  ) {
    const user = await this.userQueryRepo.getById(userId);

    if (!user) throw new UnauthorizedException();

    const { version } =
      this.authService.getSessionVersionAndExpirationDate(refreshToken);

    const session = await this.sessionRepo.findSessionByVersion(version);

    if (!session) throw new UnauthorizedException();

    const command = new RefreshTokenCommand({
      userId,
      deviceId,
      sessionId: session._id.toString(),
    });

    const { refresh, access } = await this.commandBus.execute(command);

    this.cookiesService.write(response, 'refreshToken', refresh);
    this.cookiesService.write(response, 'accessToken', access);

    return { accessToken: access };
  }
}
