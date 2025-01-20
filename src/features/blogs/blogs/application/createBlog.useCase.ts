import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../infrastructure';

export class CreateBlogCommand {
  constructor(
    readonly payload: {
      userId: string;
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
    return this.blogsRepository.create({
      name: payload.name,
      websiteUrl: payload.websiteUrl,
      description: payload.description,
      isMembership: false,
      ownerId: payload.userId,
    });
  }
}
