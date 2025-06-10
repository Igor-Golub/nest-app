import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserParams {
  @ApiProperty({
    name: 'id',
    type: 'string',
    required: true,
    example: '9f8e1c7a-2d47-4c2d-a4e1-bb91c8123456',
    description: 'UUID of existing user',
  })
  @IsString()
  id: string;
}
