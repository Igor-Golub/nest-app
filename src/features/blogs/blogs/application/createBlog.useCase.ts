import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepo } from '../infrastructure';

export class CreateBlogCommand {
  constructor(
    readonly payload: {
      name: string;
      websiteUrl: string;
      description: string;
    },
  ) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogHandler implements ICommandHandler<CreateBlogCommand> {
  constructor(private readonly blogsRepo: BlogsRepo) {}

  public async execute({ payload }: CreateBlogCommand) {
    const { _id } = await this.blogsRepo.create(payload);

    return { id: _id.toString() };
  }
}
