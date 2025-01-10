import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../infrastructure';

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
  constructor(private readonly blogsRepository: BlogsRepository) {}

  public async execute({ payload }: CreateBlogCommand) {
    return this.blogsRepository.create(payload);
  }
}
