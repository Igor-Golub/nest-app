import { DataSource, QueryRunner } from 'typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';
import { DomainError } from '../../../core/errors';
import { Answer, Game, Participant } from '../domain';
import { User } from '../../users/domain/user.entity';
import { GameRepo, QuestionRepo } from '../infrastructure';
import { AnswerStatus, GameStatus } from '../infrastructure/enums';
import { TransactionService } from '../../../infrastructure/services/transaction.service';

@Injectable()
export class GameService {
  constructor(
    private readonly gameRepo: GameRepo,
    private readonly dataSource: DataSource,
    private readonly questionRepo: QuestionRepo,
    private readonly transactionService: TransactionService,
  ) {}

  public async connectUser(gameId: string, userId: string) {
    return this.transactionService.runInTransaction(this.dataSource, async (queryRunner) => {
      const game = await this.findGameOrFail(queryRunner, gameId);

      const secondPlayer = await queryRunner.manager.findOne(User, {
        where: {
          id: userId,
        },
      });

      if (!secondPlayer) throw new DomainError(`Connect failed`, HttpStatus.BAD_REQUEST);

      const participant = queryRunner.manager.create(Participant, {
        game,
        user: secondPlayer,
      });

      await queryRunner.manager.save(participant);

      await queryRunner.manager.update(Game, game.id, {
        startedAt: new Date(),
        status: GameStatus.Active,
      });

      return game;
    });
  }

  public async createGame(firstPlayerId: string) {
    return this.transactionService.runInTransaction(this.dataSource, async (queryRunner) => {
      const questions = await this.generateSetOfQuestions();

      const game = queryRunner.manager.create(Game, {
        questions,
        finishedAt: null,
        startedAt: new Date(),
        pairCreatedAt: new Date(),
        status: GameStatus.Pending,
      });

      await queryRunner.manager.save(game);

      const firstPlayer = await queryRunner.manager.findOne(User, {
        where: {
          id: firstPlayerId,
        },
      });

      if (!firstPlayer) throw new DomainError(`User with ID ${firstPlayerId} not found`, HttpStatus.BAD_REQUEST);

      const participant = queryRunner.manager.create(Participant, {
        game,
        user: firstPlayer,
      });

      await queryRunner.manager.save(participant);

      return this.findGameOrFail(queryRunner, game.id);
    });
  }

  public async answerToQuestion(gameId: string, userId: string, inputAnswer: string) {
    return this.transactionService.runInTransaction(this.dataSource, async (queryRunner) => {
      const game = await this.findGameOrFail(queryRunner, gameId);

      const question = this.getGameQuestionByAnswer(game, inputAnswer);
      const participant = this.getGameParticipantById(game, userId);

      const answer = queryRunner.manager.create(Answer, {
        question,
        participant,
        status: !!question ? AnswerStatus.Correct : AnswerStatus.InCorrect,
      });

      await queryRunner.manager.save(answer);

      return answer;
    });
  }

  public async checkIsUserAlreadyInGame(userId: string) {
    return this.gameRepo.checkIsUserAlreadyInGame(userId);
  }

  public async findAvailableGames() {
    return this.gameRepo.findAvailableGames(2);
  }

  private async generateSetOfQuestions() {
    return this.questionRepo.getRandom(5);
  }

  private async findGameOrFail(queryRunner: QueryRunner, gameId: string) {
    const game = await queryRunner.manager.findOne(Game, {
      where: {
        id: gameId,
      },
      relations: {
        questions: true,
        participants: true,
      },
    });

    if (!game) throw new DomainError(`Connect failed`, HttpStatus.BAD_REQUEST);

    return game;
  }

  private getGameQuestionByAnswer(game: Game, answer: string) {
    return game.questions.find(({ answers }) => answers.includes(answer));
  }

  private getGameParticipantById(game: Game, userId: string) {
    return game.participants.find(({ id }) => id === userId);
  }
}
