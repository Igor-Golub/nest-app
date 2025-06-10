import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmRegistrationDto {
  @ApiProperty({
    example: '231-312-3-123-12-3ss',
    description: 'Confirmation code',
  })
  @IsString()
  code: string;
}
