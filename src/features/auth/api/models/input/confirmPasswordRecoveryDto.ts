import { IsString } from 'class-validator';
import { IsStringWithExpectedLength } from '../../../../../common/decorators';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmPasswordRecoveryDto {
  @ApiProperty({
    example: 'N3wSecur3P@ss',
    description: 'New password to set (6–20 characters)',
    minLength: 6,
    maxLength: 20,
  })
  @IsStringWithExpectedLength(6, 20)
  newPassword: string;

  @ApiProperty({
    example: 'c2a8b15f-dcc2-4f1c-a9d0-7f54b7a3e621',
    description: 'Recovery code sent to the user email',
  })
  @IsString()
  recoveryCode: string;
}
