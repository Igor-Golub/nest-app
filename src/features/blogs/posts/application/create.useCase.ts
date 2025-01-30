import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../infrastructure/posts.repo';

interface CreatePostCommandPayload {
  data: {
    userId: string;
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

  public async execute({ payload: { data } }: CreatePostCommand) {
    const { id } = await this.postsRepository.create({
      content: data.content,
      blogId: data.blogId,
      title: data.title,
      shortDescription: data.shortDescription,
    });

    return id;
  }
}
