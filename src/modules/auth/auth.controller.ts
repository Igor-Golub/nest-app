import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginDto';
import { PasswordRecoveryDto } from './dto/passwordRecoveryDto';
import { ConfirmPasswordRecoveryDto } from './dto/confirmPasswordRecoveryDto';
import { ConfirmRegistrationDto } from './dto/confirmRegistrationDto';
import { RegistrationDto } from './dto/registrationDto';
import { ResendConfirmationDto } from './dto/resendConfirmationDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/me')
  public async getProfile() {}

  @Post('/login')
  public async login(@Body() loginDto: LoginDto) {}

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
  ) {}

  @Post('/registration')
  public async registration(@Body() registrationDto: RegistrationDto) {}

  @Post('/registration-email-resending')
  public async resendConfirmationRegistration(
    @Body() resendConfirmationRegistrationDto: ResendConfirmationDto,
  ) {}
}
