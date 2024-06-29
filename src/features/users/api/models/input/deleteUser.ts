import { IsStringWithExpectedLength } from '@app/common/decorators';

export class DeleteUserDto {
  @IsStringWithExpectedLength(24, 24)
  id: string;
}
