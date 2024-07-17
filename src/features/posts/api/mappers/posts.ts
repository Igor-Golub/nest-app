import { LikeStatus } from '../../../../common/enums';
import { PostViewModel } from '../models/output';

export class PostsViewMapperManager {
  static mapPostsToViewModel(dbModel): PostViewModel {
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
        myStatus: LikeStatus.None,
        newestLikes: [],
      },
    };
  }

  static addLikeStatus(post: PostViewModel, status: LikeStatus | undefined) {
    return {
      ...post,
      extendedLikesInfo: {
        ...post.extendedLikesInfo,
        myStatus: status ?? post.extendedLikesInfo.myStatus,
      },
    };
  }
}
