import { LikeStatus } from '../../../../../common/enums';
import { PostComment } from '../../domain/postComment.entity';
import { CommentViewModel } from '../models/output/comment';

export class CommentsViewMapperManager {
  static commentWithoutLikesToViewModel(
    comment: PostComment,
  ): CommentViewModel {
    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      commentatorInfo: {
        userId: comment.authorId,
        userLogin: comment.author.login,
      },
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatus.None,
      },
    };
  }

  static commentWithLikeToViewModel(
    comment: PostComment,
    reqUserId: string | undefined,
  ): CommentViewModel {
    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      commentatorInfo: {
        userId: comment.authorId,
        userLogin: comment.author.login,
      },
      likesInfo: comment.likes.reduce<CommentViewModel['likesInfo']>(
        (acc, like) => {
          if (like.status === LikeStatus.Like) acc.likesCount += 1;
          if (like.status === LikeStatus.Dislike) acc.dislikesCount += 1;
          if (reqUserId && reqUserId === like.ownerId) {
            acc.myStatus = like.status;
          }

          return acc;
        },
        {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: LikeStatus.None,
        },
      ),
    };
  }
}
