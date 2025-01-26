import { IsUUID } from 'class-validator';
import { IsStringWithExpectedLength } from '../../../../../../common/decorators';

export class CreatePostCommentParams {
  @IsUUID()
  id: string;
}

export class CreatePostComment {
  @IsStringWithExpectedLength(20, 300)
  content: string;
}
