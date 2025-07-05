import { GameRepo } from '../infrastructure';
import { HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { DomainError } from '../../../core/errors';
import { Answer, Game, Participant } from '../domain';
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
      const { current, second } = this.getCurrentAnsSecondPlayers(game, userId);
      const question = this.getGameQuestionByIndex(game, current.answers.length);

      const isCorrect = question.answers.includes(inputAnswer);
      const answerStatus = isCorrect ? AnswerStatus.Correct : AnswerStatus.Incorrect;

      const answer = queryRunner.manager.create(Answer, { participant: current, question, status: answerStatus });

      await queryRunner.manager.save(answer);

      if (isCorrect) {
        await this.updatePlayerScore(queryRunner, current.id, 1);
      }

      if (await this.gameRepo.checkIsGameFinished(game.id)) {
        const hasSecondPlayerCorrectAnswer = second.answers.some(({ status }) => status === AnswerStatus.Correct);

        const currentPlayerScores = isCorrect ? current.score : current.score + 1;
        const secondPlayerScores = hasSecondPlayerCorrectAnswer ? second.score + 1 : second.score;

        await this.giveBonusPoints(queryRunner, second);
        await this.handleUpdateGameResultsForParticipants(
          queryRunner,
          current,
          second,
          currentPlayerScores,
          secondPlayerScores,
        );
        await this.finishGame(queryRunner, game.id);
      }

      return answer;
    });
  }

  private async handleUpdateGameResultsForParticipants(
    queryRunner: QueryRunner,
    currentPlayer: Participant,
    secondPlayer: Participant,
    currentPlayerScores: number,
    secondPlayerScores: number,
  ) {
    let player1Result: PlayerResultOfGame = PlayerResultOfGame.Draw;
    let player2Result: PlayerResultOfGame = PlayerResultOfGame.Draw;

    if (currentPlayerScores > secondPlayerScores) {
      player1Result = PlayerResultOfGame.Won;
      player2Result = PlayerResultOfGame.Lost;
    } else if (currentPlayerScores < secondPlayerScores) {
      player1Result = PlayerResultOfGame.Lost;
      player2Result = PlayerResultOfGame.Won;
    }

    await queryRunner.manager.update(Participant, currentPlayer.id, { resultOfGame: player1Result });
    await queryRunner.manager.update(Participant, secondPlayer.id, { resultOfGame: player2Result });
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
}
