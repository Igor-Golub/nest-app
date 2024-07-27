import { NotFoundException } from '@nestjs/common';
import { PostsRepo } from '../infrastructure/posts.repo';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

interface DeletePostCommandPayload {
  id: string;
}

export class DeletePostCommand {
  constructor(readonly payload: DeletePostCommandPayload) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostHandler implements ICommandHandler<DeletePostCommand> {
  constructor(private readonly postsRepo: PostsRepo) {}

  public async execute({ payload: { id } }: DeletePostCommand) {
    const result = await this.postsRepo.delete(id);

    if (!result) throw new NotFoundException();

    return true;
  }
}
