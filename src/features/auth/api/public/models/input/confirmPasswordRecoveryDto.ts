import { IsString } from 'class-validator';
import { IsStringWithExpectedLength } from '../../../../../../common/decorators';

export class ConfirmPasswordRecoveryDto {
  @IsStringWithExpectedLength(6, 20)
  newPassword: string;

  @IsString()
  recoveryCode: string;
}
