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
    return this.transactionService.runInTransaction(
      this.dataSource,
      async (queryRunner) => {
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
      },
      {
        lockMode: 'for_update',
      },
    );
  }

  public async createGame(firstPlayerId: string) {
    return this.transactionService.runInTransaction(this.dataSource, async (queryRunner) => {
      const questions = await this.generateSetOfQuestions();

      const game = queryRunner.manager.create(Game, {
        questions,
        startedAt: null,
        finishedAt: null,
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

      // Как определить на какой вопрос отвечает игрок?
      const answer = queryRunner.manager.create(Answer, {
        participant,
        question: question ?? game.questions[0],
        status: !!question ? AnswerStatus.Correct : AnswerStatus.InCorrect,
      });

      await queryRunner.manager.save(answer);

      const isFinished = await this.gameRepo.checkIsGameFinished(gameId);

      if (isFinished) {
        const secondPlayer = game.participants.find(({ user }) => user.id !== userId);

        await this.addAdditionalScore(secondPlayer);

        await queryRunner.manager.update(Game, game.id, {
          finishedAt: new Date(),
          status: GameStatus.Finished,
        });
      }

      return answer;
    });
  }

  public async checkIsUserAlreadyInGame(userId: string) {
    return this.gameRepo.checkIsUserAlreadyInGame(userId);
  }

  public async checkAmountOfAnswers(gameId: string, userId: string) {
    const amount = await this.gameRepo.checkAmountOfAnswers(gameId, userId);
    return amount >= 5;
  }

  public async checkIsGameReadyForAnswers(gameId: string) {
    const game = await this.gameRepo.findById(gameId);

    return game.status === GameStatus.Active;
  }

  public async findAvailableGames() {
    return this.gameRepo.findAvailableGames(2);
  }

  private async generateSetOfQuestions() {
    return this.questionRepo.getRandom(5);
  }

  private async findGameOrFail(queryRunner: QueryRunner, gameId: string) {
    const game = await queryRunner.manager
      .createQueryBuilder(Game, 'game')
      .leftJoinAndSelect('game.questions', 'questions')
      .leftJoinAndSelect('game.participants', 'participants')
      .leftJoinAndSelect('participants.answers', 'answers')
      .leftJoinAndSelect('participants.user', 'user')
      .where('game.id = :gameId', { gameId })
      .getOne();

    if (!game) throw new DomainError(`Connect failed`, HttpStatus.BAD_REQUEST);

    return game;
  }

  private getGameQuestionByAnswer(game: Game, answer: string) {
    return game.questions.find(({ answers }) => answers.includes(answer));
  }

  private getGameParticipantById(game: Game, userId: string) {
    return game.participants.find(({ user }) => user.id === userId);
  }

  private async addAdditionalScore(participant: Participant | undefined) {
    const isNeedAddAdditionalScore =
      participant && participant.answers.some(({ status }) => status === AnswerStatus.Correct);

    if (isNeedAddAdditionalScore) return;

    console.log('-----', `need to add additional score to ${participant}`);
  }
}
