import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'User login or email',
  })
  @IsString()
  loginOrEmail: string;

  @ApiProperty({
    example: 'P@ssw0rd!',
    description: 'User password',
  })
  @IsString()
  password: string;
}

export class LoginViewModel {
  @ApiProperty({
    description: 'User access token',
  })
  accessToken: string;
}
