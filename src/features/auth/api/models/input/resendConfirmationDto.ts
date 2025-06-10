import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResendConfirmationDto {
  @ApiProperty({
    example: 'newuser@example.com',
    description: 'Unique email address',
    format: 'email',
  })
  @IsEmail()
  email: string;
}
