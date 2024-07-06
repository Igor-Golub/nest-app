import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class UpdateCommentLikeCommand {
  constructor(readonly payload: any) {}
}

@CommandHandler(UpdateCommentLikeCommand)
export class UpdateCommentLikeHandler
  implements ICommandHandler<UpdateCommentLikeCommand>
{
  public async execute({ payload }: UpdateCommentLikeCommand) {}
}
