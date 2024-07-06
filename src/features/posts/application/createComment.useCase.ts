import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeStatus } from '../../../common/enums';

interface CreatePostCommentPayload {
  postId: string;
  content: string;
}

export class CreatePostCommentCommand {
  constructor(readonly payload: CreatePostCommentPayload) {}
}

@CommandHandler(CreatePostCommentCommand)
export class CreatePostCommentHandler
  implements ICommandHandler<CreatePostCommentCommand>
{
  constructor() {}

  public async execute({
    payload: { postId, content },
  }: CreatePostCommentCommand) {}
}
