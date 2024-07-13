import { LikeStatus } from '../../../../../common/enums';

export interface CommentViewModel extends ViewModels.BaseModel {
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
  };
}
