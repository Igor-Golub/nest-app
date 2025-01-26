import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeStatus } from '../../../../common/enums';
import { PostsLikesRepo } from '../infrastructure/postsLikes.repo';

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
  constructor(private readonly repository: PostsLikesRepo) {}

  public async execute({
    payload: { postId, nextLikeStatus, userId },
  }: UpdatePostLikeStatusCommand) {
    const like = await this.repository.findLikeByUserIdAndPostId(
      userId,
      postId,
    );

    if (!like) {
      await this.repository.create({
        postId,
        ownerId: userId,
        status: nextLikeStatus,
      });
    } else {
      await this.repository.updateStatus(like.id, nextLikeStatus);
    }

    return true;
  }
}
