import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Participant } from '../domain';
import { PlayerResultOfGame } from './enums';
import { StatisticViewModel } from '../api/models/output';

@Injectable()
export class StatisticsQueryRepo {
  constructor(@InjectRepository(Participant) private participantRepo: Repository<Participant>) {}

  public async getUserStatistic(userId: string): Promise<StatisticViewModel> {
    const participants = await this.participantRepo.find({ where: { user: { id: userId } } });

    const calcResults = participants.reduce<Omit<StatisticViewModel, 'avgScores' | 'gamesCount'>>(
      (results, participant) => {
        results.sumScore += participant.score;

        if (participant.resultOfGame === PlayerResultOfGame.Won) {
          results.winsCount += 1;
        }

        if (participant.resultOfGame === PlayerResultOfGame.Lost) {
          results.lossesCount += 1;
        }

        if (participant.resultOfGame === PlayerResultOfGame.Draw) {
          results.drawsCount += 1;
        }

        return results;
      },
      { sumScore: 0, winsCount: 0, drawsCount: 0, lossesCount: 0 },
    );

    const allGamesAmount = participants.length;

    return {
      gamesCount: allGamesAmount,
      avgScores: this.formatScore(calcResults.sumScore / allGamesAmount),
      ...calcResults,
    };
  }

  private formatScore(score: number) {
    const rounded = Math.round(score * 100) / 100;
    return rounded % 1 === 0 ? rounded : +rounded.toFixed(2).replace(/\.?0+$/, '');
  }
}
