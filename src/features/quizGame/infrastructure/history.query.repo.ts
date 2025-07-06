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

    const mappedSortField = mapperFields[query.sortBy] || query.sortBy;
    const allowedSortFields = ['createdAt', 'status', 'startedAt', 'finishedAt'];

    const sortBy = allowedSortFields.includes(mappedSortField) ? mappedSortField : 'createdAt';
    const sortDirection = query.sortDirection.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const gameIdsForUser = await this.participantRepo
      .createQueryBuilder('participant')
      .select('participant.gameId', 'gameId')
      .where('participant.userId = :userId', { userId })
      .getRawMany();

    const gameIds = gameIdsForUser.map((item) => item.gameId);

    if (gameIds.length === 0) {
      return PaginatedViewDto.mapToView({
        totalCount: 0,
        size: query.pageSize,
        page: query.pageNumber,
        items: [],
      });
    }

    const gamesQuery = this.gameRepo.createQueryBuilder('game').where('game.id IN (:...gameIds)', { gameIds });

    gamesQuery.orderBy(`game.${sortBy}`, sortDirection);

    gamesQuery.addOrderBy('game.createdAt', 'DESC');

    const totalCount = await gamesQuery.getCount();
    const gamesPaginated = await gamesQuery
      .skip((query.pageNumber - 1) * query.pageSize)
      .take(query.pageSize)
      .getMany();

    const paginatedGameIds = gamesPaginated.map((game) => game.id);

    const gamesWithRelations = await this.gameRepo
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.questions', 'questions')
      .leftJoinAndSelect('game.participants', 'participants')
      .leftJoinAndSelect('participants.answers', 'answers')
      .leftJoinAndSelect('participants.user', 'user')
      .leftJoinAndSelect('answers.question', 'question')
      .where('game.id IN (:...paginatedGameIds)', { paginatedGameIds })
      .orderBy('participants.createdAt', 'ASC')
      .addOrderBy('questions.createdAt', 'ASC')
      .addOrderBy('answers.createdAt', 'ASC')
      .getMany();

    const sortedGames = paginatedGameIds.map((id) => gamesWithRelations.find((game) => game.id === id)).filter(Boolean);

    return PaginatedViewDto.mapToView({
      totalCount,
      size: query.pageSize,
      page: query.pageNumber,
      items: sortedGames.map(GameMapManager.mapGameToView),
    });
  }
}
