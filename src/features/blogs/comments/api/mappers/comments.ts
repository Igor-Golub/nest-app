import { LikeStatus } from '../../../../../common/enums';
import { PostComment } from '../../domain/postComment.entity';
import { CommentViewModel } from '../models/output/comment';

export class CommentsViewMapperManager {
  static commentWithoutLikesToViewModel(dbModel) {
    return {
      id: dbModel._id.toString(),
      content: dbModel.content,
      commentatorInfo: {
        userId: dbModel.userId,
        userLogin: dbModel.userLogin,
      },
      createdAt: dbModel._id._id.getTimestamp(),
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
      createdAt: comment.createdAt.toISOString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.authorId,
        userLogin: comment.author.login,
      },
      likesInfo: comment.likes
        .filter(({ commentId }) => commentId === comment.id)
        .reduce<CommentViewModel['likesInfo']>(
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
