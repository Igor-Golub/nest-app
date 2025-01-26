import { IsUUID } from 'class-validator';
import { IsStringWithExpectedLength } from '../../../../../../common/decorators';

export class UpdateCommentParams {
  @IsUUID()
  id: string;
}

export class UpdateComment {
  @IsStringWithExpectedLength(20, 300)
  content: string;
}
