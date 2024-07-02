import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepo } from '../infrastructure/blogs.repo';

export class UpdateBlogCommand {
  constructor(
    readonly payload: {
      id: string;
      updateData: {
        name: string;
        description: string;
        websiteUrl: string;
      };
    },
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogHandler implements ICommandHandler<UpdateBlogCommand> {
  constructor(private readonly blogsRepo: BlogsRepo) {}

  public async execute({ payload }: UpdateBlogCommand) {
    return this.blogsRepo.update(payload.id, payload.updateData);
  }
}
