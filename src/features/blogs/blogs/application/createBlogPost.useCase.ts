import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../posts/infrastructure/posts.repo';

export class CreateBlogPostCommand {
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

@CommandHandler(CreateBlogPostCommand)
export class CreateBlogPostHandler
  implements ICommandHandler<CreateBlogPostCommand>
{
  constructor(private readonly repository: PostsRepository) {}

  public async execute({ payload }: CreateBlogPostCommand) {
    return this.repository.create({
      blogId: payload.blogId,
      title: payload.createData.title,
      content: payload.createData.content,
      shortDescription: payload.createData.shortDescription,
    });
  }
}
