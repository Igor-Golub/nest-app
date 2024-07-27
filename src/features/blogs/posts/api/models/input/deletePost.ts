import { IsStringWithExpectedLength } from '../../../../../../common/decorators';

export class DeletePostParams {
  @IsStringWithExpectedLength(24, 24)
  id: string;
}
