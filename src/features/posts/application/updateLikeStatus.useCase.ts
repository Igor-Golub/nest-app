import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeStatus } from '../../../common/enums';
import { PostsLikesRepo, PostsRepo } from '../infrastructure';
import { LikeActions, LikeFields } from '../../../common/enums/Common';

interface UpdatePostLikeStatusCommandPayload {
  userId: string;
  postId: string;
  nextLikeStatus: LikeStatus;
}

export class UpdatePostLikeStatusCommand {
  constructor(readonly payload: UpdatePostLikeStatusCommandPayload) {}
}

@CommandHandler(UpdatePostLikeStatusCommand)
export class UpdatePostLikeStatusHandler
  implements ICommandHandler<UpdatePostLikeStatusCommand>
{
  constructor(
    private readonly postsLikesRepo: PostsLikesRepo,
    private readonly postsRepo: PostsRepo,
  ) {}

  public async execute({
    payload: { postId, nextLikeStatus, userId },
  }: UpdatePostLikeStatusCommand) {
    const like = await this.postsLikesRepo.findLikeByUserIdAndPostId(
      userId,
      postId,
    );

    if (!like) {
      await this.postsLikesRepo.create(userId, postId, nextLikeStatus);

      const conditions = this.defineUpdateConditions(
        LikeStatus.None,
        nextLikeStatus,
      );

      await this.postsRepo.updateCountOfLikes(postId, conditions);
    } else {
      await this.postsLikesRepo.updateStatus(
        like._id.toString(),
        nextLikeStatus,
      );

      const conditions = this.defineUpdateConditions(
        like.status,
        nextLikeStatus,
      );

      await this.postsRepo.updateCountOfLikes(postId, conditions);
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
