import { IsEmail } from 'class-validator';
import { LoginIsExist, EmailIsExist, IsStringWithExpectedLength } from '../../../../../common/decorators';
import { ApiProperty } from '@nestjs/swagger';

export class RegistrationDto {
  @ApiProperty({
    example: 'newuser',
    description: 'Unique login (3–10 characters)',
    minLength: 3,
    maxLength: 10,
  })
  @LoginIsExist()
  @IsStringWithExpectedLength(3, 10)
  login: string;

  @ApiProperty({
    example: 'Str0ngP@ssw0rd',
    description: 'Password (6–20 characters)',
    minLength: 6,
    maxLength: 20,
  })
  @IsStringWithExpectedLength(6, 20)
  password: string;

  @ApiProperty({
    example: 'newuser@example.com',
    description: 'Unique email address',
    format: 'email',
  })
  @EmailIsExist()
  @IsEmail()
  email: string;
}
