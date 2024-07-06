import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsCommentsRepo } from '../../comments/infrastructure/comments.repo';

interface CreatePostCommentPayload {
  postId: string;
  userId: string;
  content: string;
  userLogin: string;
}

export class CreatePostCommentCommand {
  constructor(readonly payload: CreatePostCommentPayload) {}
}

@CommandHandler(CreatePostCommentCommand)
export class CreatePostCommentHandler
  implements ICommandHandler<CreatePostCommentCommand>
{
  constructor(private readonly postsCommentsRepo: PostsCommentsRepo) {}

  public async execute({ payload }: CreatePostCommentCommand) {
    return this.postsCommentsRepo.createComment(payload);
  }
}
