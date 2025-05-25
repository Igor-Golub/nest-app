import { IsEmail } from 'class-validator';
import { LoginIsExist, EmailIsExist, IsStringWithExpectedLength } from '../../../../../common/decorators';

export class RegistrationDto {
  @LoginIsExist()
  @IsStringWithExpectedLength(3, 10)
  login: string;

  @IsStringWithExpectedLength(6, 20)
  password: string;

  @EmailIsExist()
  @IsEmail()
  email: string;
}
