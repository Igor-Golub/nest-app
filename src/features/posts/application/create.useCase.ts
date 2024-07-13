import { PostsRepo } from '../infrastructure';
import { LikeStatus } from '../../../common/enums';
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
    const { _id, id, title, shortDescription, content } =
      await this.postsRepo.create({ blogName: blog.name, ...data });

    const newPost: ViewModels.PostWithFullLikes = {
      id,
      title,
      content,
      createdAt: _id._id.getTimestamp().toISOString(),
      shortDescription,
      blogId: blog.id,
      blogName: blog.name,
      extendedLikesInfo: {
        myStatus: LikeStatus.None,
        likesCount: 0,
        dislikesCount: 0,
        newestLikes: [],
      },
    };

    return newPost;
  }
}
