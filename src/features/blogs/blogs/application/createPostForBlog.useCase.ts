import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepo } from '../../posts/infrastructure';

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
  constructor(private readonly postsRepo: PostsRepo) {}

  public async execute({ payload }: CreatePostForBlogCommand) {
    const { id } = await this.postsRepo.create({
      blogId: payload.blogId,
      blogName: payload.blogName,
      ...payload.createData,
    });

    return id;
  }
}
