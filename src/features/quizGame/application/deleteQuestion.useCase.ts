import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GameService } from './game.service';

interface DeleteQuestionPayload {
  questionId: string;
}

export class DeleteQuestionCommand {
  constructor(readonly payload: DeleteQuestionPayload) {}
}

@CommandHandler(DeleteQuestionCommand)
export class DeleteQuestionHandler
  implements ICommandHandler<DeleteQuestionCommand>
{
  constructor(private gameService: GameService) {}

  public async execute({ payload: { questionId } }: DeleteQuestionCommand) {
    return null;
  }
}
