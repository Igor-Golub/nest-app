import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepo } from '../infrastructure/blogs.repository';

export class DeleteBlogCommand {
  constructor(
    readonly payload: {
      id: string;
    },
  ) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogHandler implements ICommandHandler<DeleteBlogCommand> {
  constructor(private readonly blogsRepo: BlogsRepo) {}

  public async execute({ payload }: DeleteBlogCommand) {
    return this.blogsRepo.delete(payload.id);
  }
}
