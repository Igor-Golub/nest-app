import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GameService } from './game.service';
import { DomainError } from '../../../core/errors';

interface AnswerCommandPayload {
  gameId: string;
  userId: string;
  answer: string;
}

export class AnswerCommand {
  constructor(readonly payload: AnswerCommandPayload) {}
}

@CommandHandler(AnswerCommand)
export class AnswerCommandHandler implements ICommandHandler<AnswerCommand> {
  constructor(private gameService: GameService) {}

  public async execute({ payload: { gameId, answer, userId } }: AnswerCommand) {
    const userAlreadyInGame = await this.gameService.checkIsUserAlreadyInGame(userId);

    if (!userAlreadyInGame) throw new DomainError('User not in game', HttpStatus.FORBIDDEN);

    const { id } = await this.gameService.answerToQuestion(gameId, userId, answer);

    return id;
  }
}
