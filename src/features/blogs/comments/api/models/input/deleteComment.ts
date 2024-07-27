import { IsStringWithExpectedLength } from '../../../../../../common/decorators';

export class DeleteCommentParams {
  @IsStringWithExpectedLength(24, 24)
  id: string;
}
