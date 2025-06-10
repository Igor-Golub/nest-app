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
} from '../models/input';
import { UsersQueryRepository } from '../../../users/infrastructure';
import {
  ConfirmPasswordRecoveryCommand,
  ConfirmRegistrationCommand,
  LoginCommand,
  PasswordRecoveryCommand,
  RegisterCommand,
  ResendConfirmationCommand,
} from '../../application/auth';
import { AuthViewMapperManager } from '../mappers';
import { JwtAuthGuard, JwtCookieRefreshAuthGuard } from '../../guards';
import { RefreshTokenCommand } from '../../application/auth/refreshToken.useCase';
import { CookiesService } from '../../../../infrastructure/services/cookies.service';
import { CurrentDevice, CurrentSession, CurrentUserId } from '../../../../common/pipes';
import { LogoutCommand } from '../../application/auth';
import { SessionService } from '../../application/sessions/session.service';
import { UsersService } from '../../../users/application';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProfileViewModel } from '../models/output';
import { LoginViewModel } from '../models/input/loginDto';

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

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly userQueryRepository: UsersQueryRepository,
    private readonly cookiesService: CookiesService,
    private readonly sessionService: SessionService,
    private readonly usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({ description: 'User profile returned successfully', type: ProfileViewModel })
  @ApiUnauthorizedResponse({ description: 'No authenticated' })
  @ApiBadRequestResponse({ description: 'User not found' })
  @UseGuards(JwtAuthGuard)
  @Get(AuthRoutes.Me)
  public async getProfile(@CurrentUserId() currentUserId: string) {
    const data = await this.userQueryRepository.findById(currentUserId);

    if (!data) throw new NotFoundException();

    return AuthViewMapperManager.mapProfileToView(data);
  }

  @ApiOperation({ summary: 'Login user and set auth cookies' })
  @ApiOkResponse({ description: 'Login successful, access token returned', type: LoginViewModel })
  @ApiBadRequestResponse({ description: 'Input invalid' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiTooManyRequestsResponse({ description: 'Throttle limit' })
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @Post(AuthRoutes.Login)
  public async login(
    @Res({ passthrough: true }) response: Response,
    @Body() { loginOrEmail, password }: LoginDto,
    @CurrentDevice() { deviceIp, deviceName },
  ) {
    await this.sleep();

    const user = await this.userQueryRepository.findByEmailOrLogin(loginOrEmail);

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

  @ApiOperation({ summary: 'Send password recovery email' })
  @ApiOkResponse({ description: 'Recovery email sent' })
  @ApiBadRequestResponse({ description: 'Input invalid' })
  @ApiTooManyRequestsResponse({ description: 'Throttle limit' })
  @UseGuards(ThrottlerGuard)
  @Post(AuthRoutes.PasswordRecovery)
  public async recoveryPassword(@Body() passwordRecoveryDto: PasswordRecoveryDto) {
    const command = new PasswordRecoveryCommand(passwordRecoveryDto);

    return this.commandBus.execute(command);
  }

  @ApiOperation({ summary: 'Set new password after recovery' })
  @ApiOkResponse({ description: 'Password changed successfully' })
  @ApiTooManyRequestsResponse({ description: 'Throttle limit' })
  @UseGuards(ThrottlerGuard)
  @Post(AuthRoutes.NewPassword)
  public async confirmPasswordRecovery(@Body() confirmPasswordRecoveryDto: ConfirmPasswordRecoveryDto) {
    const command = new ConfirmPasswordRecoveryCommand(confirmPasswordRecoveryDto);

    return await this.commandBus.execute(command);
  }

  @ApiOperation({ summary: 'Confirm user registration' })
  @ApiNoContentResponse({ description: 'Confirmation successful' })
  @ApiTooManyRequestsResponse({ description: 'Throttle limit' })
  @UseGuards(ThrottlerGuard)
  @Post(AuthRoutes.Confirmation)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async confirmRegistration(@Body() confirmRegistrationDto: ConfirmRegistrationDto) {
    const command = new ConfirmRegistrationCommand(confirmRegistrationDto);

    return await this.commandBus.execute(command);
  }

  @ApiOperation({ summary: 'Register a new user' })
  @ApiNoContentResponse({ description: 'Registration successful' })
  @ApiTooManyRequestsResponse({ description: 'Throttle limit' })
  @UseGuards(ThrottlerGuard)
  @Post(AuthRoutes.Registration)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async registration(@Body() registrationDto: RegistrationDto) {
    const command = new RegisterCommand(registrationDto);

    return await this.commandBus.execute(command);
  }

  @ApiOperation({ summary: 'Resend confirmation email' })
  @ApiNoContentResponse({ description: 'Email resent successfully' })
  @ApiNotFoundResponse({ description: 'User with this email not found' })
  @ApiTooManyRequestsResponse({ description: 'Throttle limit' })
  @UseGuards(ThrottlerGuard)
  @Post(AuthRoutes.RegistrationEmailResending)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async resendConfirmation(@Body() resendConfirmation: ResendConfirmationDto) {
    const { email } = resendConfirmation;

    const user = await this.userQueryRepository.findByEmailOrLogin(email);

    if (!user) {
      throw new BadRequestException([{ field: 'email', message: 'Email not found' }]);
    }

    const command = new ResendConfirmationCommand(resendConfirmation);

    return await this.commandBus.execute(command);
  }

  @ApiOperation({ summary: 'Refresh access and refresh tokens' })
  @ApiOkResponse({ description: 'Tokens refreshed successfully' })
  @ApiUnauthorizedResponse({ description: 'No authenticated' })
  @ApiTooManyRequestsResponse({ description: 'Throttle limit' })
  @UseGuards(ThrottlerGuard)
  @UseGuards(JwtCookieRefreshAuthGuard)
  @Post(AuthRoutes.Refresh)
  @HttpCode(HttpStatus.OK)
  public async refreshToken(
    @Res({ passthrough: true }) response: Response,
    @CurrentSession() { refreshToken }: Base.Session,
  ) {
    const session = await this.sessionService.isSessionExist(refreshToken);

    await this.usersService.isUserExist(session.ownerId, 'unauthorized');

    await this.sessionService.isSessionOfCurrentUser(session.ownerId, session.deviceId);

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

  @ApiOperation({ summary: 'Logout user and clear session' })
  @ApiNoContentResponse({ description: 'Logout successful' })
  @ApiUnauthorizedResponse({ description: 'No authenticated' })
  @Post(AuthRoutes.Logout)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtCookieRefreshAuthGuard)
  public async logout(@CurrentSession() { id: userId, deviceId, refreshToken }: Base.Session) {
    await this.sessionService.isSessionExist(refreshToken);

    const command = new LogoutCommand({ deviceId, ownerId: userId });

    await this.commandBus.execute<LogoutCommand, boolean>(command);
  }

  private async sleep(ms: number = 1000) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
