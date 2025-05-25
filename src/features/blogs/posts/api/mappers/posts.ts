import { LikeStatus } from '../../../../../common/enums';
import { Post } from '../../domain/post.entity';
import { PostViewModelWithLikes } from '../models/output';
import { PostLike } from '../../domain/postLikes.entity';

export class PostsViewMapperManager {
  static addDefaultLikesData(post: Post) {
    return {
      id: post.id,
      title: post.title,
      blogId: post.blogId,
      content: post.content,
      blogName: post.blog.name,
      createdAt: post.createdAt.toISOString(),
      shortDescription: post.shortDescription,
      extendedLikesInfo: {
        myStatus: LikeStatus.None,
        likesCount: 0,
        dislikesCount: 0,
        newestLikes: [],
      },
    };
  }

  static mapPostsToViewModelWithLikes(
    post: Post,
    likes: PostLike[],
    reqUserId: string | undefined,
  ): PostViewModelWithLikes {
    return {
      id: post.id,
      title: post.title,
      blogId: post.blogId,
      content: post.content,
      blogName: post.blog.name,
      createdAt: post.createdAt.toISOString(),
      shortDescription: post.shortDescription,
      extendedLikesInfo: likes.reduce<PostViewModelWithLikes['extendedLikesInfo']>(
        (acc, like) => {
          if (like.status === LikeStatus.Like) acc.likesCount += 1;
          if (like.status === LikeStatus.Dislike) acc.dislikesCount += 1;

          if (reqUserId && reqUserId === like.ownerId) {
            acc.myStatus = like.status;
          }

          if (like.status === LikeStatus.Like && acc.newestLikes.length < 3) {
            acc.newestLikes.push({
              userId: like.ownerId,
              login: like.owner.login,
              addedAt: like.createdAt.toISOString(),
            });
          }

          return acc;
        },
        {
          likesCount: 0,
          dislikesCount: 0,
          newestLikes: [],
          myStatus: LikeStatus.None,
        },
      ),
    };
  }
}
