import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GameService } from './game.service';

interface AnswerCommandPayload {
  gameId: string;
  answer: string;
}

export class AnswerCommand {
  constructor(readonly payload: AnswerCommandPayload) {}
}

@CommandHandler(AnswerCommand)
export class AnswerCommandHandler implements ICommandHandler {
  constructor(private gameService: GameService) {}

  public async execute({ payload: { gameId, answer } }: AnswerCommand) {
    return null;
  }
}
