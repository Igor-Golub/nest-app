import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeStatus } from '../../../common/enums';
import { PostsLikesRepo } from '../infrastructure';

interface UpdatePostLikeStatusCommandPayload {
  userId: string;
  userLogin: string;
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
    payload: { postId, nextLikeStatus, userId, userLogin },
  }: UpdatePostLikeStatusCommand) {
    const like = await this.postsLikesRepo.findLikeByUserIdAndPostId(
      userId,
      postId,
    );

    if (!like) {
      await this.postsLikesRepo.create(
        userId,
        userLogin,
        postId,
        nextLikeStatus,
      );
    } else {
      await this.postsLikesRepo.updateStatus(
        like._id.toString(),
        nextLikeStatus,
      );
    }

    return true;
  }
}
