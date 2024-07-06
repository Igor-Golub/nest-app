import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class UpdateCommentLikeStatusCommand {
  constructor(readonly payload: any) {}
}

@CommandHandler(UpdateCommentLikeStatusCommand)
export class UpdateCommentLikeStatusHandler
  implements ICommandHandler<UpdateCommentLikeStatusCommand>
{
  public async execute({}: UpdateCommentLikeStatusCommand) {}
}
