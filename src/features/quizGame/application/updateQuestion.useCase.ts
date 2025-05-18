import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GameService } from './game.service';

interface UpdateQuestionPayload {
  questionId: string;
}

export class UpdateQuestionCommand {
  constructor(readonly payload: UpdateQuestionPayload) {}
}

@CommandHandler(UpdateQuestionCommand)
export class UpdateQuestionHandler
  implements ICommandHandler<UpdateQuestionCommand>
{
  constructor(private gameService: GameService) {}

  public async execute({ payload: { questionId } }: UpdateQuestionCommand) {
    return null;
  }
}
