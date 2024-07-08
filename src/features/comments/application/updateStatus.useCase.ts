import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeStatus } from '../../../common/enums';
import { PostsCommentsLikesRepo } from '../infrastructure/postCommentsLikes.repo';
import { PostsCommentsLikesQueryRepo } from '../infrastructure/postCommentsLikes.query.repo';
import { PostsCommentsRepo } from '../infrastructure/comments.repo';

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
    } else {
      await this.postsCommentsLikesRepo.updateStatus(commentId, nextStatus);
    }

    await this.postsCommentsRepo.updateLikeStatus(commentId, nextStatus);

    return true;
  }
}
