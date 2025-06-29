import { HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GameService } from './game.service';
import { DomainError } from '../../../core/errors';
import { AnswerService } from './answer.service';

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
  constructor(
    private gameService: GameService,
    private answerService: AnswerService,
  ) {}

  public async execute({ payload: { gameId, answer, userId } }: AnswerCommand) {
    await this.checkIsCanAnswer(gameId, userId);

    const { id } = await this.answerService.answerToQuestion(gameId, userId, answer);

    return id;
  }

  public async checkIsCanAnswer(gameId: string, userId: string) {
    const userAlreadyInGame = await this.gameService.checkIsUserAlreadyInGame(userId);

    if (!userAlreadyInGame) throw new DomainError('User not in game', HttpStatus.FORBIDDEN);

    const isGameReadyForAnswers = await this.gameService.checkIsGameReadyForAnswers(gameId);

    if (!isGameReadyForAnswers) throw new DomainError('Game not ready yet', HttpStatus.FORBIDDEN);

    const isUserAnsweredForAllQueries = await this.gameService.checkAmountOfAnswers(gameId, userId);

    if (isUserAnsweredForAllQueries) throw new DomainError('Answered for all queries', HttpStatus.FORBIDDEN);
  }
}
