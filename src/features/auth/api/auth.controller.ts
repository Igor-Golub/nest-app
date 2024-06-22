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
import { AuthService } from '../application/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { CurrentUserId } from '../../../common/pipes/current.userId';

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
    private readonly authService: AuthService,
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
    return this.authService.login(currentUserId);
  }

  @Post(AuthRoutes.PasswordRecovery)
  public async recoveryPassword(
    @Body() passwordRecoveryDto: PasswordRecoveryDto,
  ) {
    return this.authService.passwordRecovery(passwordRecoveryDto);
  }

  @Post(AuthRoutes.NewPassword)
  public async confirmPasswordRecovery(
    @Body() confirmPasswordRecoveryDto: ConfirmPasswordRecoveryDto,
  ) {
    return this.authService.confirmPasswordRecovery(confirmPasswordRecoveryDto);
  }

  @Post(AuthRoutes.Confirmation)
  public async confirmRegistration(
    @Body() confirmRegistrationDto: ConfirmRegistrationDto,
  ) {
    return this.authService.confirmRegistration(confirmRegistrationDto.code);
  }

  @Post(AuthRoutes.Registration)
  @HttpCode(HttpStatus.CREATED)
  public async registration(@Body() registrationDto: RegistrationDto) {
    return this.authService.register(registrationDto);
  }

  @Post(AuthRoutes.RegistrationEmailResending)
  public async resendConfirmation(
    @Body() resendConfirmation: ResendConfirmationDto,
  ) {
    return this.authService.resendConfirmation(resendConfirmation);
  }
}
