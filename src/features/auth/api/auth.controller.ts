import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { LoginDto } from './models/input/loginDto';
import { PasswordRecoveryDto } from './models/input/passwordRecoveryDto';
import { ConfirmPasswordRecoveryDto } from './models/input/confirmPasswordRecoveryDto';
import { ConfirmRegistrationDto } from './models/input/confirmRegistrationDto';
import { RegistrationDto } from './models/input/registrationDto';
import { ResendConfirmationDto } from './models/input/resendConfirmationDto';
import { UsersService } from '../../users/application/users.service';
import { UsersQueryRepo } from '../../users/infrastructure/users.query.repo';

enum AuthRoutes {
  Me = '/me',
  Login = '/login',
  NewPassword = '/new-password',
  Registration = '/registration',
  PasswordRecovery = '/password-recovery',
  Confirmation = '/registration-confirmation',
  RegistrationEmailResending = '/registration-email-resending',
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userQueryRepo: UsersQueryRepo,
  ) {}

  @Get(AuthRoutes.Me)
  public async getProfile() {
    return this.userQueryRepo.getProfile();
  }

  @Post(AuthRoutes.Login)
  public async login(@Body() loginDto: LoginDto) {
    return this.usersService.login(loginDto);
  }

  @Post(AuthRoutes.PasswordRecovery)
  public async recoveryPassword(
    @Body() passwordRecoveryDto: PasswordRecoveryDto,
  ) {
    return this.usersService.passwordRecovery(passwordRecoveryDto);
  }

  @Post(AuthRoutes.NewPassword)
  public async confirmPasswordRecovery(
    @Body() confirmPasswordRecoveryDto: ConfirmPasswordRecoveryDto,
  ) {
    return this.usersService.confirmPasswordRecovery(
      confirmPasswordRecoveryDto,
    );
  }

  @Post(AuthRoutes.Confirmation)
  public async confirmRegistration(
    @Body() confirmRegistrationDto: ConfirmRegistrationDto,
  ) {
    return this.usersService.confirmRegistration(confirmRegistrationDto.code);
  }

  @Post(AuthRoutes.Registration)
  @HttpCode(HttpStatus.CREATED)
  public async registration(@Body() registrationDto: RegistrationDto) {
    return this.usersService.register(registrationDto);
  }

  @Post(AuthRoutes.RegistrationEmailResending)
  public async resendConfirmationRegistration(
    @Body() resendConfirmationRegistrationDto: ResendConfirmationDto,
  ) {
    return this.usersService.resendConfirmationRegistration(
      resendConfirmationRegistrationDto,
    );
  }
}
