import { NotFoundException } from '@nestjs/common';
import { PostsRepo } from '../infrastructure/posts.repo';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

interface DeletePostCommandPayload {
  id: string;
}

export class UpdatePostCommand {
  constructor(readonly payload: DeletePostCommandPayload) {}
}

@CommandHandler(UpdatePostCommand)
export class DeletePostHandler implements ICommandHandler<UpdatePostCommand> {
  constructor(private readonly postsRepo: PostsRepo) {}

  public async execute({ payload: { id } }: UpdatePostCommand) {
    const result = await this.postsRepo.delete(id);

    if (!result) throw new NotFoundException();

    return true;
  }
}
