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
  constructor(private readonly repository: BlogsRepository) {}

  public async execute({ payload }: CreateBlogCommand) {
    return this.repository.create({
      name: payload.name,
      websiteUrl: payload.websiteUrl,
      description: payload.description,
      isMembership: false,
    });
  }
}
