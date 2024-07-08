import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsCommentsRepo } from '../infrastructure/comments.repo';

export class UpdateCommentLikeCommand {
  constructor(
    readonly payload: {
      id: string;
      content: string;
    },
  ) {}
}

@CommandHandler(UpdateCommentLikeCommand)
export class UpdateCommentLikeHandler
  implements ICommandHandler<UpdateCommentLikeCommand>
{
  constructor(private readonly postsCommentRepo: PostsCommentsRepo) {}

  public async execute({ payload: { id, content } }: UpdateCommentLikeCommand) {
    return this.postsCommentRepo.update(id, content);
  }
}
