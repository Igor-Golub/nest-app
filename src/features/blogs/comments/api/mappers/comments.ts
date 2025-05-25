import { LikeStatus } from '../../../../../common/enums';
import { PostComment } from '../../domain/postComment.entity';
import { CommentViewModel } from '../models/output/comment';

export class CommentsViewMapperManager {
  static commentWithoutLikesToViewModel(comment: PostComment): CommentViewModel {
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

  static commentWithLikeToViewModel(comment: PostComment, reqUserId: string | undefined): CommentViewModel {
    const likesCount = comment.likes.filter(({ status }) => status === LikeStatus.Like).length;

    const dislikesCount = comment.likes.filter(({ status }) => status === LikeStatus.Dislike).length;

    const myLike = comment.likes.find(({ ownerId }) => ownerId === reqUserId);
    const myStatus = myLike?.status ?? LikeStatus.None;

    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      commentatorInfo: {
        userId: comment.authorId,
        userLogin: comment.author.login,
      },
      likesInfo: {
        likesCount,
        dislikesCount,
        myStatus,
      },
    };
  }
}
