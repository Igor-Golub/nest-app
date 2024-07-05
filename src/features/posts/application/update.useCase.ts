import { NotFoundException } from '@nestjs/common';
import { PostsRepo } from '../infrastructure/posts.repo';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

interface UpdatePostCommandPayload {
  postId: string;
  data: {
    title: string;
    content: string;
    blogId: string;
    shortDescription: string;
  };
}

export class UpdatePostCommand {
  constructor(readonly payload: UpdatePostCommandPayload) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostHandler implements ICommandHandler<UpdatePostCommand> {
  constructor(private readonly postsRepo: PostsRepo) {}

  public async execute({ payload: { postId, data } }: UpdatePostCommand) {
    const result = await this.postsRepo.update(postId, data);

    if (!result) throw new NotFoundException();

    return true;
  }
}
