import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../infrastructure';

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
  constructor(private readonly blogsRepository: BlogsRepository) {}

  public async execute({ payload }: UpdateBlogCommand) {
    return this.blogsRepository.update(payload.id, payload.updateData);
  }
}
