import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../infrastructure';

export class DeleteBlogCommand {
  constructor(
    readonly payload: {
      id: string;
    },
  ) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogHandler implements ICommandHandler<DeleteBlogCommand> {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  public async execute({ payload }: DeleteBlogCommand) {
    return this.blogsRepository.delete(payload.id);
  }
}
