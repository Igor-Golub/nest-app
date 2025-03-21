import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../posts/infrastructure/posts.repo';

export class CreatePostForBlogCommand {
  constructor(
    readonly payload: {
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
    return this.repository.create({
      blogId: payload.blogId,
      title: payload.createData.title,
      content: payload.createData.content,
      shortDescription: payload.createData.shortDescription,
    });
  }
}
