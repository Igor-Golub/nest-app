import { IsEnum, IsUUID } from 'class-validator';
import { LikeStatus } from '../../../../../../common/enums';

export class UpdateCommentLikeStatusParams {
  @IsUUID()
  id: string;
}

export class UpdateCommentLikeStatus {
  @IsEnum(LikeStatus)
  likeStatus: LikeStatus;
}
