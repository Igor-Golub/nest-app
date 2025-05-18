import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GameService } from './game.service';

interface PublishQuestionPayload {
  questionId: string;
}

export class PublishQuestionCommand {
  constructor(readonly payload: PublishQuestionPayload) {}
}

@CommandHandler(PublishQuestionCommand)
export class PublishQuestionHandler
  implements ICommandHandler<PublishQuestionCommand>
{
  constructor(private gameService: GameService) {}

  public async execute({ payload: { questionId } }: PublishQuestionCommand) {
    return null;
  }
}
