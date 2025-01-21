import { LikeStatus } from '../../../../../../common/enums';

interface CommentatorInfo {
  userId: string;
  userLogin: string;
}

interface LikesInfo {
  likesCount: number;
  myStatus: LikeStatus;
  dislikesCount: number;
}

export interface CommentViewModel {
  id: string;
  content: string;
  createdAt: string;
  likesInfo: LikesInfo;
  commentatorInfo: CommentatorInfo;
}
