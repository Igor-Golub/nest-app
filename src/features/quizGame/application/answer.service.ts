import { GameRepo } from '../infrastructure';
import { HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { DomainError } from '../../../core/errors';
import { Answer, Game, Participant, Question } from '../domain';
import { AnswerStatus, GameStatus } from '../infrastructure/enums';
import { TransactionService } from '../../../infrastructure/services/transaction.service';

@Injectable()
export class AnswerService {
  constructor(
    private readonly gameRepo: GameRepo,
    private readonly dataSource: DataSource,
    private readonly transactionService: TransactionService,
  ) {}

  public async answerToQuestion(gameId: string, userId: string, inputAnswer: string) {
    return this.transactionService.runInTransaction(this.dataSource, async (queryRunner) => {
      const game = await this.gameRepo.findFullGameOrFail(queryRunner, gameId);
      const { current, second } = this.getCurrentAnsSecondPlayers(game, userId);
      const question = this.getGameQuestionByIndex(game, current.answers.length);

      const isCorrect = question.answers.includes(inputAnswer);

      const answer = await this.createAnswer(
        queryRunner,
        current,
        question,
        isCorrect ? AnswerStatus.Correct : AnswerStatus.Incorrect,
      );

      await this.handleScoreCalculation(queryRunner, current, second, isCorrect, game);

      return answer;
    });
  }

  private async createAnswer(
    queryRunner: QueryRunner,
    participant: Participant,
    question: Question,
    status: AnswerStatus,
  ) {
    const answer = queryRunner.manager.create(Answer, { participant, question, status });

    await queryRunner.manager.save(answer);
    return answer;
  }

  private getGameQuestionByIndex(game: Game, targetIndex: number) {
    const question = game.questions.find((_, index) => index === targetIndex);
    if (!question) throw new DomainError(`Question by index not found`, HttpStatus.BAD_REQUEST);

    return question;
  }

  private getCurrentAnsSecondPlayers(game: Game, userId: string) {
    const current = game.participants.find((p) => p.user.id === userId);
    const second = game.participants.find((p) => p.user.id !== userId);

    if (!current || !second) throw new DomainError(`Connect failed`, HttpStatus.BAD_REQUEST);

    return { current, second };
  }

  private async handleScoreCalculation(
    queryRunner: QueryRunner,
    currentPlayer: Participant,
    secondPlayer: Participant,
    isCorrectAnswer: boolean,
    game: Game,
  ) {
    if (isCorrectAnswer) {
      await this.updatePlayerScore(queryRunner, currentPlayer.id, 1);
    }

    if (await this.gameRepo.checkIsGameFinished(game.id)) {
      await this.giveBonusPoints(queryRunner, secondPlayer);
      await this.finishGame(queryRunner, game.id);
    }
  }

  private async giveBonusPoints(queryRunner: QueryRunner, secondPlayer: Participant) {
    const hasSecondPlayerCorrectAnswer = secondPlayer.answers.some(({ status }) => status === AnswerStatus.Correct);

    if (hasSecondPlayerCorrectAnswer) await this.updatePlayerScore(queryRunner, secondPlayer.id, 1);
  }

  private async updatePlayerScore(queryRunner: QueryRunner, playerId: string, points: number) {
    await queryRunner.manager.increment(Participant, { id: playerId }, 'score', points);
  }

  private async finishGame(queryRunner: QueryRunner, gameId: string) {
    await queryRunner.manager.update(Game, gameId, {
      finishedAt: new Date(),
      status: GameStatus.Finished,
    });
  }
}
