import { IsEnum } from 'class-validator';
import { IsStringWithExpectedLength } from '../../../../../../common/decorators';
import { LikeStatus } from '../../../../../../common/enums';

export class UpdatePostLikeStatusParams {
  @IsStringWithExpectedLength(24, 24)
  id: string;
}

export class UpdatePostLikeStatus {
  @IsEnum(LikeStatus)
  likeStatus: LikeStatus;
}
