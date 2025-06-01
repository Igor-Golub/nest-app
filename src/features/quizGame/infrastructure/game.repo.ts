import { Injectable } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { Game } from '../domain';

@Injectable()
export class GameRepo {
  constructor(private readonly gameRepo: Repository<Game>) {}

  public async checkIsUserAlreadyInGame(userId: string) {
    const numberOfOccurrences = await this.gameRepo
      .createQueryBuilder('game')
      .leftJoin('game.participants', 'participant')
      .where('participant.id = :id', { id: userId })
      .getCount();

    return Boolean(numberOfOccurrences);
  }

  public async findAvailableGames(amountOfParticipants: number) {
    return this.gameRepo
      .createQueryBuilder('game')
      .leftJoin('game.participants', 'participant')
      .groupBy('game.id')
      .having('COUNT(participant.id) < :count', { count: amountOfParticipants })
      .getOne();
  }

  public async attachUserToGame(gameId: string, userId: string) {
    await this.gameRepo.update(gameId, {
      participants: [],
    });
  }

  public async create(dto: DeepPartial<Game>) {
    return this.gameRepo.create(dto);
  }
}
