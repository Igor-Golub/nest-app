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
    return this.postsRepo.update(postId, data);
  }
}
