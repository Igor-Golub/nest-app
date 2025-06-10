import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordRecoveryDto {
  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'User  email',
  })
  @IsEmail()
  email: string;
}
