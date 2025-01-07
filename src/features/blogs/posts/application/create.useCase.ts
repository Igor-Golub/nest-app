import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../infrastructure/posts.repo';

interface CreatePostCommandPayload {
  blog: any;
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
  constructor(private readonly postsRepository: PostsRepository) {}

  public async execute({ payload: { data, blog } }: CreatePostCommand) {
    const { id } = await this.postsRepository.create({
      blogName: blog.name,
      ...data,
    });

    return id;
  }
}
