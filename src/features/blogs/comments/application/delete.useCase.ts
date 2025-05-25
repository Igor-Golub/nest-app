import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsCommentsRepo } from '../infrastructure';

export class DeleteCommentCommand {
  constructor(
    readonly payload: {
      id: string;
    },
  ) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentHandler implements ICommandHandler<DeleteCommentCommand> {
  constructor(private readonly repository: PostsCommentsRepo) {}
  public async execute({ payload: { id } }: DeleteCommentCommand) {
    return this.repository.delete(id);
  }
}
