import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../posts/infrastructure/posts.repo';

export class DeleteBlogPostCommand {
  constructor(
    readonly payload: {
      blogId: string;
      postId: string;
    },
  ) {}
}

@CommandHandler(DeleteBlogPostCommand)
export class DeleteBlogPostHandler implements ICommandHandler<DeleteBlogPostCommand> {
  constructor(private readonly repository: PostsRepository) {}

  public async execute({ payload: { postId, blogId } }: DeleteBlogPostCommand) {
    return this.repository.deleteBlogPost(blogId, postId);
  }
}
