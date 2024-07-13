import { LikeStatus } from '../../../../common/enums';

export function mapPostsToViewModel(dbModel, isLoggedUser: boolean = false) {
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
