import { IsEnum, IsUUID } from 'class-validator';
import { LikeStatus } from '../../../../../../common/enums';

export class UpdatePostLikeStatusParams {
  @IsUUID()
  id: string;
}

export class UpdatePostLikeStatus {
  @IsEnum(LikeStatus)
  likeStatus: LikeStatus;
}
