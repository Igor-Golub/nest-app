import { GameRepo } from '../infrastructure';
import { HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { DomainError } from '../../../core/errors';
import { Answer, Game, GameStats, Participant } from '../domain';
import { AnswerStatus, GameStatus, PlayerResultOfGame } from '../infrastructure/enums';
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
      const { current: currentPlayer, second: secondPlayer } = this.getCurrentAndSecondPlayers(game, userId);

      const question = this.getGameQuestionByIndex(game, currentPlayer.answers.length);

      const isCorrect = question.answers.includes(inputAnswer);
      const answerStatus = isCorrect ? AnswerStatus.Correct : AnswerStatus.Incorrect;

      const answer = queryRunner.manager.create(Answer, { participant: currentPlayer, question, status: answerStatus });

      await queryRunner.manager.save(answer);

      if (isCorrect) {
        await this.incrementPlayerScore(queryRunner, currentPlayer.id, 1);
      }

      if (await this.gameRepo.checkIsGameFinished(game.id)) {
        await this.finalizeGame(queryRunner, game.id, currentPlayer, secondPlayer, isCorrect);
      }

      return answer;
    });
  }

  private async finalizeGame(
    queryRunner: QueryRunner,
    gameId: string,
    currentPlayer: Participant,
    secondPlayer: Participant,
    isLastAnswerCorrect: boolean,
  ) {
    const currentPlayerScore = isLastAnswerCorrect ? currentPlayer.score + 1 : currentPlayer.score;
    const secondPlayerScore = this.hasCorrectAnswer(secondPlayer) ? secondPlayer.score + 1 : secondPlayer.score;

    if (this.hasCorrectAnswer(secondPlayer)) {
      await this.incrementPlayerScore(queryRunner, secondPlayer.id, 1);
    }

    await this.updateGameResults(queryRunner, currentPlayer, secondPlayer, currentPlayerScore, secondPlayerScore);
    await this.markGameAsFinished(queryRunner, gameId);
  }

  private async updateGameResults(
    queryRunner: QueryRunner,
    currentPlayer: Participant,
    secondPlayer: Participant,
    currentScore: number,
    secondScore: number,
  ) {
    const [currentResult, secondResult] = this.calculateResults(currentScore, secondScore);

    await queryRunner.manager.update(Participant, currentPlayer.id, { resultOfGame: currentResult });

    const currentStats = await queryRunner.manager.findOne(GameStats, {
      where: { user: { id: currentPlayer.user.id } },
    });

    if (currentStats) {
      await queryRunner.manager.update(GameStats, currentStats.id, {
        gamesCount: currentStats.gamesCount + 1,
        sumScore: currentStats.sumScore + currentScore,
        avgScores: +((currentStats.sumScore + currentScore) / (currentStats.gamesCount + 1)).toFixed(2),
        ...(currentResult === PlayerResultOfGame.Won && { winsCount: currentStats.winsCount + 1 }),
        ...(currentResult === PlayerResultOfGame.Draw && { drawsCount: currentStats.drawsCount + 1 }),
        ...(currentResult === PlayerResultOfGame.Lost && { lossesCount: currentStats.lossesCount + 1 }),
      });
    }

    await queryRunner.manager.update(Participant, secondPlayer.id, { resultOfGame: secondResult });

    const secondStats = await queryRunner.manager.findOne(GameStats, {
      where: { user: { id: secondPlayer.user.id } },
    });

    if (secondStats) {
      await queryRunner.manager.update(GameStats, secondStats.id, {
        gamesCount: secondStats.gamesCount + 1,
        sumScore: secondStats.sumScore + currentScore,
        avgScores: +((secondStats.sumScore + currentScore) / (secondStats.gamesCount + 1)).toFixed(2),
        ...(secondResult === PlayerResultOfGame.Won && { winsCount: secondStats.winsCount + 1 }),
        ...(secondResult === PlayerResultOfGame.Draw && { drawsCount: secondStats.drawsCount + 1 }),
        ...(secondResult === PlayerResultOfGame.Lost && { lossesCount: secondStats.lossesCount + 1 }),
      });
    }
  }

  private calculateResults(currentScore: number, secondScore: number): [PlayerResultOfGame, PlayerResultOfGame] {
    if (currentScore > secondScore) {
      return [PlayerResultOfGame.Won, PlayerResultOfGame.Lost];
    } else if (currentScore < secondScore) {
      return [PlayerResultOfGame.Lost, PlayerResultOfGame.Won];
    } else {
      return [PlayerResultOfGame.Draw, PlayerResultOfGame.Draw];
    }
  }

  private async incrementPlayerScore(queryRunner: QueryRunner, playerId: string, points: number) {
    await queryRunner.manager.increment(Participant, { id: playerId }, 'score', points);
  }

  private async markGameAsFinished(queryRunner: QueryRunner, gameId: string) {
    await queryRunner.manager.update(Game, gameId, { finishedAt: new Date(), status: GameStatus.Finished });
  }

  private hasCorrectAnswer(participant: Participant): boolean {
    return participant.answers.some(({ status }) => status === AnswerStatus.Correct);
  }

  private getGameQuestionByIndex(game: Game, index: number) {
    const question = game.questions[index];

    if (!question) {
      throw new DomainError('Question by index not found', HttpStatus.BAD_REQUEST);
    }

    return question;
  }

  private getCurrentAndSecondPlayers(game: Game, userId: string) {
    const current = game.participants.find((p) => p.user.id === userId);
    const second = game.participants.find((p) => p.user.id !== userId);

    if (!current || !second) {
      throw new DomainError('Connect failed', HttpStatus.BAD_REQUEST);
    }

    return { current, second };
  }
}
