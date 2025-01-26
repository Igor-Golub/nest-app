import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsCommentsRepo } from '../../comments/infrastructure';

interface CreatePostCommentPayload {
  postId: string;
  userId: string;
  content: string;
}

export class CreatePostCommentCommand {
  constructor(readonly payload: CreatePostCommentPayload) {}
}

@CommandHandler(CreatePostCommentCommand)
export class CreatePostCommentHandler
  implements ICommandHandler<CreatePostCommentCommand>
{
  constructor(private readonly repository: PostsCommentsRepo) {}

  public async execute({ payload }: CreatePostCommentCommand) {
    return this.repository.create({
      postId: payload.postId,
      content: payload.content,
      authorId: payload.userId,
    });
  }
}
