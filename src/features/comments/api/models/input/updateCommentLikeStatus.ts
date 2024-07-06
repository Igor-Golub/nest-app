import { LikeStatus } from '../../../../../common/enums';
import { IsEnum } from 'class-validator';
import { IsStringWithExpectedLength } from '../../../../../common/decorators';

export class UpdateCommentLikeStatusParams {
  @IsStringWithExpectedLength(24, 24)
  id: string;
}

export class UpdateCommentLikeStatus {
  @IsEnum(LikeStatus)
  likeStatus: LikeStatus;
}
