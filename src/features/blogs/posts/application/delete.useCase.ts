import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../infrastructure/posts.repo';

interface DeletePostCommandPayload {
  id: string;
}

export class DeletePostCommand {
  constructor(readonly payload: DeletePostCommandPayload) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostHandler implements ICommandHandler<DeletePostCommand> {
  constructor(private readonly postsRepository: PostsRepository) {}

  public async execute({ payload: { id } }: DeletePostCommand) {
    const result = await this.postsRepository.delete(id);

    if (!result) throw new NotFoundException();

    return true;
  }
}
