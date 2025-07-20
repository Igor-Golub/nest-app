import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameStats } from '../domain';
import { RepositoryError } from '../../../core/errors';
import { StatisticViewModel } from '../api/models/output';
import { UsersTopQueryParams } from '../api/models/input';
import { PaginatedViewDto } from '../../../common/dto/base.paginated.view-dto';
import { SortDirection } from '../../../common/enums';

@Injectable()
export class StatisticsQueryRepo {
  constructor(@InjectRepository(GameStats) private gameStatsRepository: Repository<GameStats>) {}

  private readonly DEFAULT_SORT = ['avgScores desc', 'sumScore desc'];

  private parseSort(sort?: string[] | string): Record<string, 'ASC' | 'DESC'> {
    const sortArray = Array.isArray(sort) ? sort : sort ? [sort] : this.DEFAULT_SORT;

    const order: Record<string, SortDirection> = {};

    for (const item of sortArray) {
      const [field, direction] = item.split(' ');
      if (!field || !direction) continue;

      const normalizedDirection = direction.toUpperCase();
      if (normalizedDirection !== SortDirection.Asc && normalizedDirection !== SortDirection.Desc) continue;

      const validFields = ['avgScores', 'sumScore', 'winsCount', 'lossesCount', 'drawsCount', 'gamesCount'];

      if (validFields.includes(field)) {
        order[field] = normalizedDirection;
      }
    }

    return order;
  }

  public async getTopUsers(query: UsersTopQueryParams) {
    const order = this.parseSort(query.sort);

    const [stats, totalCount] = await this.gameStatsRepository.findAndCount({
      take: query.pageSize,
      skip: (query.pageNumber - 1) * query.pageSize,
      order,
    });

    return PaginatedViewDto.mapToView({
      totalCount,
      size: query.pageSize,
      page: query.pageNumber,
      items: stats.map(this.mapToView),
    });
  }

  public async getUserStatistic(userId: string): Promise<StatisticViewModel> {
    const stats = await this.gameStatsRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });

    if (!stats) throw new RepositoryError(`Statistics not found for user ${userId}`);

    return this.mapToView(stats);
  }

  private formatScore(score: number) {
    const rounded = Math.round(score * 100) / 100;
    return rounded % 1 === 0 ? rounded : +rounded.toFixed(2).replace(/\.?0+$/, '');
  }

  private mapToView(stats: GameStats): StatisticViewModel {
    return {
      sumScore: stats.sumScore,
      winsCount: stats.winsCount,
      drawsCount: stats.drawsCount,
      gamesCount: stats.gamesCount,
      lossesCount: stats.lossesCount,
      avgScores: this.formatScore(stats.sumScore / stats.gamesCount),
    };
  }
}
