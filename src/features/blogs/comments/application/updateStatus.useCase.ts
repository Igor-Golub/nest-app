import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  PostsCommentsLikesQueryRepository,
  PostsCommentsLikesRepo,
} from '../infrastructure';
import { LikeStatus } from '../../../../common/enums';

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
    private readonly postsCommentsLikesRepo: PostsCommentsLikesRepo,
    private readonly postsCommentsLikesQueryRepo: PostsCommentsLikesQueryRepository,
  ) {}

  public async execute({ payload }: UpdateCommentLikeStatusCommand) {
    const { commentId, nextStatus, userId, userLogin } = payload;

    const like =
      await this.postsCommentsLikesQueryRepo.findLikeByUserIdAndCommentId(
        userId,
        commentId,
      );

    if (!like) {
      await this.postsCommentsLikesRepo.create({
        status: nextStatus,
        commentId,
        userId,
        userLogin,
      });
    } else {
      await this.postsCommentsLikesRepo.updateStatus(like.id, nextStatus);
    }

    return true;
  }
}
