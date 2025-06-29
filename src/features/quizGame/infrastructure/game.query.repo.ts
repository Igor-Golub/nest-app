import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Game, Participant } from '../domain';
import { RepositoryError } from '../../../core/errors';
import { GameStatus } from './enums';

@Injectable()
export class GameQueryRepo {
  constructor(
    @InjectRepository(Game)
    private gameRepo: Repository<Game>,
    @InjectRepository(Participant) private participantRepo: Repository<Participant>,
  ) {}

  public async isGameExist(id: string) {
    const game = await this.gameRepo.createQueryBuilder('game').where('game.id = :gameId', { gameId: id }).getExists();

    if (!game) throw new RepositoryError(`Game does not exist`);
  }

  public async findById(id: string) {
    const game = await this.gameRepo
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.questions', 'questions')
      .leftJoinAndSelect('game.participants', 'participants')
      .leftJoinAndSelect('participants.answers', 'answers')
      .leftJoinAndSelect('participants.user', 'user')
      .leftJoinAndSelect('answers.question', 'question')
      .where('game.id = :gameId', { gameId: id })
      .getOne();

    if (!game) throw new RepositoryError(`Game does not exist`);

    return game;
  }

  public async findByParticipantId(userId: string, httpErrorStatus: HttpStatus = HttpStatus.NOT_FOUND) {
    const participant = await this.participantRepo.findOne({
      where: {
        user: {
          id: userId,
        },
        game: {
          status: In([GameStatus.Active, GameStatus.Pending]),
        },
      },
      relations: {
        game: true,
      },
    });

    if (!participant || !participant.game || participant.game.status === GameStatus.Finished) {
      throw new RepositoryError(`Game not found for user ${userId}`, httpErrorStatus);
    }

    const gameId = participant.game.id;

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
