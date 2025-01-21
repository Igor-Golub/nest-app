import { LikeStatus } from '../../../../../../common/enums';

interface Like {
  addedAt: string;
  userId: string;
  login: string;
}

interface LikesInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: Like[];
}

export interface PostViewModelWithLikes {
  id: string;
  title: string;
  blogId: string;
  content: string;
  blogName: string;
  createdAt: string;
  shortDescription: string;
  extendedLikesInfo: LikesInfo;
}
