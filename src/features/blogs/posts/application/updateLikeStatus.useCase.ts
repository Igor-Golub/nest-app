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
  constructor(private readonly postsLikesRepo: PostsLikesRepo) {}

  public async execute({
    payload: { postId, nextLikeStatus, userId },
  }: UpdatePostLikeStatusCommand) {
    const like = await this.postsLikesRepo.findLikeByUserIdAndPostId(
      userId,
      postId,
    );

    if (!like) {
      await this.postsLikesRepo.create(userId, postId, nextLikeStatus);
    } else {
      await this.postsLikesRepo.updateStatus(like.id, nextLikeStatus);
    }

    return true;
  }
}
