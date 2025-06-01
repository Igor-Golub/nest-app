import { DataSource } from 'typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Game, Participant } from '../domain';
import { DomainError } from '../../../core/errors';
import { GameStatus } from '../infrastructure/enums';
import { User } from '../../users/domain/user.entity';
import { GameRepo, QuestionRepo } from '../infrastructure';
import { TransactionService } from '../../../infrastructure/services/transaction.service';

@Injectable()
export class GameService {
  constructor(
    private readonly gameRepo: GameRepo,
    private readonly dataSource: DataSource,
    private readonly questionRepo: QuestionRepo,
    private readonly transactionService: TransactionService,
  ) {}

  public async checkIsUserAlreadyInGame(userId: string) {
    const userAlreadyInGame = await this.gameRepo.checkIsUserAlreadyInGame(userId);

    if (!userAlreadyInGame) throw new DomainError('User already in game', HttpStatus.FORBIDDEN);
  }

  public async findAvailableGames() {
    return this.gameRepo.findAvailableGames(2);
  }

  public async connectUser(gameId: string, userId: string) {
    return this.transactionService.runInTransaction(this.dataSource, async (queryRunner) => {
      const game = await queryRunner.manager.findOne(Game, {
        where: {
          id: gameId,
        },
        relations: {
          questions: true,
          participants: true,
        },
      });

      const secondPlayer = await queryRunner.manager.findOne(User, {
        where: {
          id: userId,
        },
      });

      if (!game || !secondPlayer) throw new DomainError(`Connect failed`, HttpStatus.BAD_REQUEST);

      const participant = queryRunner.manager.create(Participant, { game, user: secondPlayer });
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

      const createdGame = await this.dataSource.getRepository(Game).findOne({
        where: {
          id: game.id,
        },
        relations: {
          questions: true,
          participants: true,
        },
      });

      if (!createdGame) throw new DomainError(`Creation failed`, HttpStatus.BAD_REQUEST);

      return createdGame;
    });
  }

  public async generateSetOfQuestions() {
    return this.questionRepo.getRandom(5);
  }
}
