import { PostsRepo } from '../infrastructure';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

interface CreatePostCommandPayload {
  blog: ViewModels.Blog;
  data: {
    title: string;
    content: string;
    blogId: string;
    shortDescription: string;
  };
}

export class CreatePostCommand {
  constructor(readonly payload: CreatePostCommandPayload) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(private readonly postsRepo: PostsRepo) {}

  public async execute({ payload: { data, blog } }: CreatePostCommand) {
    const { id } = await this.postsRepo.create({
      blogName: blog.name,
      ...data,
    });

    return id;
  }
}
