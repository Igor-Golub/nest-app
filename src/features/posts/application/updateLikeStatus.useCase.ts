import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeStatus } from '../../../common/enums';

interface UpdatePostLikeStatusCommandPayload {
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
  constructor() {}

  public async execute({
    payload: { postId, likeStatus },
  }: UpdatePostLikeStatusCommand) {}
}
