import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeStatus } from '../../../common/enums';
import {
  PostsCommentsLikesRepo,
  PostsCommentsLikesQueryRepo,
  PostsCommentsRepo,
} from '../infrastructure';
import { LikeActions, LikeFields } from '../../../common/enums/Common';

interface UpdatePostCommentLikeStatus {
  userId: string;
  commentId: string;
  userLogin: string;
  nextStatus: LikeStatus;
}

export class UpdateCommentLikeStatusCommand {
  constructor(readonly payload: UpdatePostCommentLikeStatus) {}
}

@CommandHandler(UpdateCommentLikeStatusCommand)
export class UpdateCommentLikeStatusHandler
  implements ICommandHandler<UpdateCommentLikeStatusCommand>
{
  constructor(
    private readonly postsCommentsRepo: PostsCommentsRepo,
    private readonly postsCommentsLikesRepo: PostsCommentsLikesRepo,
    private readonly postsCommentsLikesQueryRepo: PostsCommentsLikesQueryRepo,
  ) {}

  public async execute({ payload }: UpdateCommentLikeStatusCommand) {
    const { commentId, nextStatus, userId, userLogin } = payload;

    const like =
      await this.postsCommentsLikesQueryRepo.getLikeByCommentId(commentId);

    if (!like) {
      await this.postsCommentsLikesRepo.create(
        commentId,
        userId,
        userLogin,
        nextStatus,
      );

      const conditions = this.defineUpdateConditions(
        LikeStatus.None,
        nextStatus,
      );

      await this.postsCommentsRepo.updateCountOfLikes(commentId, conditions);
    } else {
      await this.postsCommentsLikesRepo.updateStatus(commentId, nextStatus);

      const conditions = this.defineUpdateConditions(like.status, nextStatus);

      await this.postsCommentsRepo.updateCountOfLikes(commentId, conditions);
    }

    return true;
  }

  private defineUpdateConditions(
    prev: LikeStatus,
    next: LikeStatus,
  ): { field: LikeFields; action: LikeActions }[] {
    const result: { field: LikeFields; action: LikeActions }[] = [];

    switch (true) {
      case prev === LikeStatus.Like && next === LikeStatus.None: {
        result.push({
          field: LikeFields.LikesCount,
          action: LikeActions.DEC,
        });

        break;
      }

      case prev === LikeStatus.Like && next === LikeStatus.Dislike: {
        result.push(
          { field: LikeFields.LikesCount, action: LikeActions.DEC },
          { field: LikeFields.DislikesCount, action: LikeActions.INC },
        );

        break;
      }

      case prev === LikeStatus.None && next === LikeStatus.Like: {
        result.push({ field: LikeFields.LikesCount, action: LikeActions.INC });

        break;
      }

      case prev === LikeStatus.Dislike && next === LikeStatus.None: {
        result.push({
          field: LikeFields.DislikesCount,
          action: LikeActions.DEC,
        });

        break;
      }

      case prev === LikeStatus.None && next === LikeStatus.Dislike: {
        result.push({
          field: LikeFields.DislikesCount,
          action: LikeActions.INC,
        });

        break;
      }

      case prev === LikeStatus.Dislike && next === LikeStatus.Like: {
        result.push(
          { field: LikeFields.LikesCount, action: LikeActions.INC },
          { field: LikeFields.DislikesCount, action: LikeActions.DEC },
        );

        break;
      }
    }

    return result;
  }
}
