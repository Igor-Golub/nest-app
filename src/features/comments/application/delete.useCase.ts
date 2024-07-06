import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class DeleteCommentCommand {
  constructor(readonly payload: any) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentHandler
  implements ICommandHandler<DeleteCommentCommand>
{
  public async execute({ payload }: DeleteCommentCommand) {}
}
