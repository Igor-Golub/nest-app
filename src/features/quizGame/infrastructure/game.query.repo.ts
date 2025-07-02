import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Game } from '../domain';
import { GameStatus } from './enums';
import { RepositoryError } from '../../../core/errors';

@Injectable()
export class GameQueryRepo {
  constructor(
    @InjectRepository(Game)
    private gameRepo: Repository<Game>,
  ) {}

  public async isGameExist(id: string) {
    const game = await this.gameRepo.createQueryBuilder('game').where('game.id = :gameId', { gameId: id }).getExists();

    if (!game) throw new RepositoryError(`Game does not exist`);
  }

  public async findById(gameId: string) {
    const game = await this.gameRepo
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.questions', 'questions')
      .leftJoinAndSelect('game.participants', 'participants')
      .leftJoinAndSelect('participants.answers', 'answers')
      .leftJoinAndSelect('participants.user', 'user')
      .leftJoinAndSelect('answers.question', 'question')
      .where('game.id = :gameId', { gameId })
      .orderBy('participants.createdAt', 'ASC')
      .addOrderBy('questions.createdAt', 'ASC')
      .addOrderBy('answers.createdAt', 'DESC')
      .getOne();

    if (!game) throw new RepositoryError(`Game does not exist`);
    return game;
  }

  public async findByParticipantId(userId: string, httpErrorStatus: HttpStatus = HttpStatus.NOT_FOUND) {
    const game = await this.gameRepo
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.participants', 'participant')
      .where('participant.userId = :userId', { userId })
      .andWhere('game.status IN (:...statuses)', {
        statuses: [GameStatus.Active, GameStatus.Pending],
      })
      .getOne();

    if (!game || game.status === GameStatus.Finished) {
      throw new RepositoryError(`Game not found for user ${userId}`, httpErrorStatus);
    }

    const gameId = game.id;

    return this.findById(gameId);
  }

  public async checkIsUserHasAccessToGame(gameId: string, userId: string) {
    return this.gameRepo
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.participants', 'participants')
      .leftJoinAndSelect('participants.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('game.id = :gameId', { gameId })
      .getExists();
  }
}
