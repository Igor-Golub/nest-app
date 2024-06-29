import { IsEmail } from 'class-validator';
import {
  IsStringWithExpectedLength,
  LoginIsExist,
  Trim,
} from '../../../../../common/decorators';

export class CreateUserDto {
  @Trim()
  @IsStringWithExpectedLength(3, 10)
  @LoginIsExist()
  login: string;

  @Trim()
  @IsEmail()
  email: string;

  @IsStringWithExpectedLength(6, 20)
  password: string;
}
