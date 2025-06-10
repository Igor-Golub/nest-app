import { ApiProperty } from '@nestjs/swagger';

export class UserViewModel {
  @ApiProperty({
    description: 'Unique user identifier',
    example: '507f1f77bcf86cd799439011',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'User login name',
    example: 'john_doe',
    minLength: 3,
    maxLength: 10,
    type: String,
  })
  login: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    format: 'email',
    type: String,
  })
  email: string;

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2023-12-01T10:30:00.000Z',
    format: 'date-time',
    type: String,
  })
  createdAt: string;
}
