import { LikeStatus } from '../../../../common/enums';
import { PostViewModel } from '../models/output';

export function mapPostsToViewModel(
  dbModel,
  isLoggedUser: boolean = false,
): PostViewModel {
  return {
    id: dbModel._id.toString(),
    createdAt: dbModel._id.getTimestamp().toISOString(),
    content: dbModel.content,
    blogName: dbModel.blogName,
    blogId: dbModel.blogId,
    title: dbModel.title,
    shortDescription: dbModel.shortDescription,
    extendedLikesInfo: {
      likesCount: dbModel.likesCount,
      dislikesCount: dbModel.dislikesCount,
      myStatus: isLoggedUser ? dbModel.currentLikeStatus : LikeStatus.None,
      newestLikes: [],
    },
  };
}
