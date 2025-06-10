import { IsEmail } from 'class-validator';
import { IsStringWithExpectedLength, LoginIsExist, Trim } from '../../../../../common/decorators';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Unique user login',
    example: 'john_doe',
    minLength: 3,
    maxLength: 10,
    type: String,
  })
  @Trim()
  @IsStringWithExpectedLength(3, 10)
  @LoginIsExist()
  login: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    format: 'email',
    type: String,
  })
  @Trim()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'mySecurePassword123',
    minLength: 6,
    maxLength: 20,
    type: String,
    writeOnly: true,
  })
  @IsStringWithExpectedLength(6, 20)
  password: string;
}
