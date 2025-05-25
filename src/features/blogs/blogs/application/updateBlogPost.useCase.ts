import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../posts/infrastructure/posts.repo';

export class UpdateBlogPostCommand {
  constructor(
    readonly payload: {
      blogId: string;
      postId: string;
      updateData: {
        title: string;
        content: string;
        shortDescription: string;
      };
    },
  ) {}
}

@CommandHandler(UpdateBlogPostCommand)
export class UpdateBlogPostHandler implements ICommandHandler<UpdateBlogPostCommand> {
  constructor(private readonly repository: PostsRepository) {}

  public async execute({ payload: { blogId, postId, updateData } }: UpdateBlogPostCommand) {
    return this.repository.updateBlogPost(blogId, postId, updateData);
  }
}
