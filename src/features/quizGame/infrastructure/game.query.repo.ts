import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Game } from '../domain';
import { RepositoryError } from '../../../core/errors';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GameQueryRepo {
  constructor(
    @InjectRepository(Game)
    private gameRepo: Repository<Game>,
  ) {}

  public async findById(id: string) {
    const game = await this.gameRepo
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.questions', 'questions')
      .leftJoinAndSelect('game.participants', 'participants')
      .leftJoinAndSelect('participants.answers', 'answers')
      .leftJoinAndSelect('participants.user', 'user')
      .where('game.id = :gameId', { gameId: id })
      .getOne();

    if (!game) throw new RepositoryError(`Game does not exist`);

    return game;
  }

  public async findByParticipantId(id: string) {
    const game = await this.gameRepo
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.questions', 'questions')
      .leftJoinAndSelect('game.participants', 'participants')
      .leftJoinAndSelect('participants.answers', 'answers')
      .leftJoinAndSelect('participants.user', 'user')
      .where('participants.user.id = :userId', { userId: id })
      .getOne();

    if (!game) throw new RepositoryError(`Game does not exist`);

    return game;
  }
}
