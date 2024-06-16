import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginDto';
import { PasswordRecoveryDto } from './dto/passwordRecoveryDto';
import { ConfirmPasswordRecoveryDto } from './dto/confirmPasswordRecoveryDto';
import { ConfirmRegistrationDto } from './dto/confirmRegistrationDto';
import { RegistrationDto } from './dto/registrationDto';
import { ResendConfirmationDto } from './dto/resendConfirmationDto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

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
  @HttpCode(HttpStatus.CREATED)
  public async registration(@Body() registrationDto: RegistrationDto) {
    return this.usersService.register(
      registrationDto.login,
      registrationDto.email,
      registrationDto.password,
    );
  }

  @Post('/registration-email-resending')
  public async resendConfirmationRegistration(
    @Body() resendConfirmationRegistrationDto: ResendConfirmationDto,
  ) {}
}
