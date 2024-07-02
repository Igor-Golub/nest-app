import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsService } from '../../posts/application/posts.service';

export class CreatePostForBlogCommand {
  constructor(
    readonly payload: {
      blogId: string;
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
  constructor(private readonly postsService: PostsService) {}

  public async execute({ payload }: CreatePostForBlogCommand) {
    const { id } = await this.postsService.create({
      blogId: payload.blogId,
      ...payload.createData,
    });

    return id;
  }
}
