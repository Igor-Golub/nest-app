import { DataSource } from 'typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';
import { DomainError } from '../../../core/errors';
import { User } from '../../users/domain/user.entity';
import { GameRepo, QuestionRepo } from '../infrastructure';
import { Game, Participant } from '../domain';
import { GameStatus } from '../infrastructure/enums';
import { TransactionService } from '../../../infrastructure/services/transaction.service';

@Injectable()
export class GameService {
  private readonly AMOUNT_OF_ANSWERS_FOR_FINISH_GAME = 5;

  private readonly AMOUNT_OF_PARTICIPANTS = 2;

  constructor(
    private readonly gameRepo: GameRepo,
    private readonly dataSource: DataSource,
    private readonly questionRepo: QuestionRepo,
    private readonly transactionService: TransactionService,
  ) {}

  public async connectUser(gameId: string, userId: string) {
    return this.transactionService.runInTransaction(this.dataSource, async (queryRunner) => {
      const game = await this.gameRepo.findFullGameOrFail(queryRunner, gameId);

      const relatedUser = await queryRunner.manager.findOne(User, {
        where: {
          id: userId,
        },
      });

      if (!relatedUser) throw new DomainError(`Connect failed. Related user not found`, HttpStatus.BAD_REQUEST);

      const participant = queryRunner.manager.create(Participant, {
        game,
        user: relatedUser,
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
        startedAt: null,
        finishedAt: null,
        status: GameStatus.Pending,
      });

      await queryRunner.manager.save(game);

      const relatedUser = await queryRunner.manager.findOne(User, {
        where: {
          id: firstPlayerId,
        },
      });

      if (!relatedUser) throw new DomainError(`User with ID ${firstPlayerId} not found`, HttpStatus.BAD_REQUEST);

      const participant = queryRunner.manager.create(Participant, {
        game,
        user: relatedUser,
      });

      await queryRunner.manager.save(participant);

      return this.gameRepo.findFullGameOrFail(queryRunner, game.id);
    });
  }

  public async checkIsUserAlreadyInGame(userId: string) {
    return this.gameRepo.checkIsUserAlreadyInGame(userId);
  }

  public async checkAmountOfAnswers(gameId: string, userId: string) {
    const amount = await this.gameRepo.checkAmountOfAnswers(gameId, userId);
    return amount >= this.AMOUNT_OF_ANSWERS_FOR_FINISH_GAME;
  }

  public async checkIsGameReadyForAnswers(gameId: string) {
    const game = await this.gameRepo.findById(gameId);

    return game.status === GameStatus.Active;
  }

  public async findAvailableGames() {
    return this.gameRepo.findAvailableGames(this.AMOUNT_OF_PARTICIPANTS);
  }

  private async generateSetOfQuestions() {
    return this.questionRepo.getRandom(this.AMOUNT_OF_ANSWERS_FOR_FINISH_GAME);
  }
}
