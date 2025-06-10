import { ApiProperty } from '@nestjs/swagger';

export class ProfileViewModel {
  @ApiProperty({ example: '8b5f8b8a-7392-4b33-bb8e-0e9bd3b1e755', description: 'Unique user ID' })
  userId: string;

  @ApiProperty({ example: 'johndoe', description: 'Login or username' })
  login: string;

  @ApiProperty({ example: 'johndoe@example.com', description: 'Email address' })
  email: string;
}
