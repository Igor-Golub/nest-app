import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../infrastructure/posts.repo';

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
  constructor(private readonly postsRepository: PostsRepository) {}

  public async execute({ payload: { postId, data } }: UpdatePostCommand) {
    return this.postsRepository.update(postId, data);
  }
}
