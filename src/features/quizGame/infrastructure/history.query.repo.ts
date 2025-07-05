import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game, Participant } from '../domain';
import { GameMapManager } from '../api/models/mappers';
import { QueryParams } from '../../../common/decorators/validate';
import { PaginatedViewDto } from '../../../common/dto/base.paginated.view-dto';

@Injectable()
export class HistoryQueryRepo {
  constructor(
    @InjectRepository(Game) private gameRepo: Repository<Game>,
    @InjectRepository(Participant) private participantRepo: Repository<Participant>,
  ) {}

  public async getHistoryAndCurrent(query: QueryParams, userId: string) {
    const mapperFields = {
      startGameDate: 'startedAt',
      pairCreatedDate: 'createdAt',
      finishGameDate: 'finishedAt',
    };

    const allowedSortFields = ['createdAt', 'status', 'startGameDate', 'finishGameDate'];

    const sortBy = allowedSortFields.includes(mapperFields[query.sortBy] ?? query.sortBy) ? query.sortBy : 'createdAt';
    const sortDirection = query.sortDirection.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const gameIdsForUser = await this.participantRepo
      .createQueryBuilder('participant')
      .select('participant.gameId', 'gameId')
      .where('participant.userId = :userId', { userId })
      .getRawMany();

    const gameIds = gameIdsForUser.map((item) => item.gameId);

    const [games, totalCount] = await this.gameRepo
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.questions', 'questions')
      .leftJoinAndSelect('game.participants', 'participants')
      .leftJoinAndSelect('participants.answers', 'answers')
      .leftJoinAndSelect('participants.user', 'user')
      .leftJoinAndSelect('answers.question', 'question')
      .where('game.id IN (:...gameIds)', { gameIds })
      .orderBy({
        'participants.createdAt': 'ASC',
        'questions.createdAt': 'ASC',
        'answers.createdAt': 'ASC',
      })
      .orderBy(`game.${sortBy}`, sortDirection)
      .skip((query.pageNumber - 1) * query.pageSize)
      .take(query.pageSize)
      .getManyAndCount();

    return PaginatedViewDto.mapToView({
      totalCount,
      size: query.pageSize,
      page: query.pageNumber,
      items: games.map(GameMapManager.mapGameToView),
    });
  }
}
