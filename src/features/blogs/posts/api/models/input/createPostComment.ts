import { IsStringWithExpectedLength } from '../../../../../../common/decorators';
import { LikeStatus } from '../../../../../../common/enums';

export class CreatePostCommentParams {
  @IsStringWithExpectedLength(24, 24)
  id: string;
}

export class CreatePostComment {
  @IsStringWithExpectedLength(20, 300)
  content: LikeStatus;
}
