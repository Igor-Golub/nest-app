import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsCommentsRepo } from '../infrastructure/comments.repo';

export class DeleteCommentCommand {
  constructor(
    readonly payload: {
      id: string;
    },
  ) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentHandler
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(private readonly postsCommentRepo: PostsCommentsRepo) {}
  public async execute({ payload: { id } }: DeleteCommentCommand) {
    return this.postsCommentRepo.delete(id);
  }
}
