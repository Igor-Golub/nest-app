import { IsStringWithExpectedLength } from '@app/common/decorators';

export class DeletePostParams {
  @IsStringWithExpectedLength(24, 24)
  id: string;
}
