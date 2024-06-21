import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { LoginDto } from './models/input/loginDto';
import { PasswordRecoveryDto } from './models/input/passwordRecoveryDto';
import { ConfirmPasswordRecoveryDto } from './models/input/confirmPasswordRecoveryDto';
import { ConfirmRegistrationDto } from './models/input/confirmRegistrationDto';
import { RegistrationDto } from './models/input/registrationDto';
import { ResendConfirmationDto } from './models/input/resendConfirmationDto';
import { UsersService } from '../../users/application/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Get('/me')
  public async getProfile() {}

  @Post('/login')
  public async login(@Body() loginDto: LoginDto) {
    this.usersService.login();
  }

  @Post('/password-recovery')
  public async recoveryPassword(
    @Body() passwordRecoveryDto: PasswordRecoveryDto,
  ) {}

  @Post('/new-password')
  public async confirmPasswordRecovery(
    @Body() confirmPasswordRecoveryDto: ConfirmPasswordRecoveryDto,
  ) {}

  @Post('/registration-confirmation')
  public async confirmRegistration(
    @Body() confirmRegistrationDto: ConfirmRegistrationDto,
  ) {
    return this.usersService.confirmation(confirmRegistrationDto.code);
  }

  @Post('/registration')
  @HttpCode(HttpStatus.CREATED)
  public async registration(@Body() registrationDto: RegistrationDto) {
    return this.usersService.register(registrationDto);
  }

  @Post('/registration-email-resending')
  public async resendConfirmationRegistration(
    @Body() resendConfirmationRegistrationDto: ResendConfirmationDto,
  ) {}
}
