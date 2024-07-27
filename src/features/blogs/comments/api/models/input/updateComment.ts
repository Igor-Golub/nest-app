import { IsStringWithExpectedLength } from '../../../../../../common/decorators';

export class UpdateCommentParams {
  @IsStringWithExpectedLength(24, 24)
  id: string;
}

export class UpdateComment {
  @IsStringWithExpectedLength(20, 300)
  content: string;
}
