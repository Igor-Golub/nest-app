import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../posts/infrastructure/posts.repo';

export class CreatePostForBlogCommand {
  constructor(
    readonly payload: {
      userId: string;
      blogId: string;
      blogName: string;
      createData: {
        title: string;
        content: string;
        shortDescription: string;
      };
    },
  ) {}
}

@CommandHandler(CreatePostForBlogCommand)
export class CreatePostForBlogHandler
  implements ICommandHandler<CreatePostForBlogCommand>
{
  constructor(private readonly repository: PostsRepository) {}

  public async execute({ payload }: CreatePostForBlogCommand) {
    const { id } = await this.repository.create({
      blogId: payload.blogId,
      authorId: payload.userId,
      title: payload.createData.title,
      content: payload.createData.content,
      shortDescription: payload.createData.shortDescription,
    });

    return id;
  }
}
