import { LikeStatus } from '../../../../../../common/enums';

export interface CommentViewModel {
  id: string;
  createdAt: string;
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
