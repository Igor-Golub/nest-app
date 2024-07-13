import { LikeStatus } from '../../../../../common/enums';

export interface PostViewModel extends ViewModels.BaseModel {
  title: string;
  blogId: string;
  content: string;
  blogName: string;
  shortDescription: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
    newestLikes: any[];
  };
}
