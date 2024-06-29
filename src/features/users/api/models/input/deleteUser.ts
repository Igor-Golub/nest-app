import { IsStringWithExpectedLength } from '../../../../../common/decorators';

export class DeleteUserDto {
  @IsStringWithExpectedLength(24, 24)
  id: string;
}
