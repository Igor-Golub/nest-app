import { LikeStatus } from '../../../../../../common/enums';

export interface PostViewModelWithLikes {
  id: string;
  title: string;
  blogId: string;
  content: string;
  blogName: string;
  createdAt: string;
  shortDescription: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
    newestLikes: {
      addedAt: string;
      userId: string;
      login: string;
    }[];
  };
}
