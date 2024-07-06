import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeStatus } from '../../../common/enums';
import { PostsLikesRepo } from '../infrastructure/postsLikes.repo';
import { PostsRepo } from '../infrastructure/posts.repo';

interface UpdatePostLikeStatusCommandPayload {
  userId: string;
  postId: string;
  likeStatus: LikeStatus;
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
    payload: { postId, likeStatus, userId },
  }: UpdatePostLikeStatusCommand) {
    const like = await this.postsLikesRepo.findLikeByUserIdAndPostId(
      userId,
      postId,
    );

    if (!like) {
      await this.postsLikesRepo.create(userId, postId, likeStatus);
    } else {
      await this.postsLikesRepo.updateStatus(like._id.toString(), likeStatus);
    }

    await this.postsRepo.updateLikes(postId, likeStatus);

    return true;
  }
}
