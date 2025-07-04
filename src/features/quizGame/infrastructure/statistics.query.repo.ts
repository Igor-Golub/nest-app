import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game, Participant } from '../domain';
import { StatisticViewModel } from '../api/models/output';

@Injectable()
export class StatisticsQueryRepo {
  constructor(
    @InjectRepository(Game) private gameRepo: Repository<Game>,
    @InjectRepository(Participant) private participantRepo: Repository<Participant>,
  ) {}

  public async getUserStatistic(userId: string): Promise<StatisticViewModel> {
    return {
      sumScore: 0,
      avgScores: 0,
      gamesCount: 0,
      winsCount: 0,
      lossesCount: 0,
      drawsCount: 0,
    };
  }
}
