import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeStatus } from '../../../common/enums';
import {
  PostsCommentsLikesQueryRepo,
  PostsCommentsLikesRepo,
} from '../infrastructure';

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
    private readonly postsCommentsLikesQueryRepo: PostsCommentsLikesQueryRepo,
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
      await this.postsCommentsLikesRepo.updateStatus(
        like._id.toString(),
        nextStatus,
      );
    }

    return true;
  }
}
