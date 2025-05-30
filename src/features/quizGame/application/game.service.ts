import { Repository } from 'typeorm';
import { Game } from '../domain';

export class GameService {
  constructor(private readonly gameRepo: Repository<Game>) {}

  public async findAvailableGames(amoutnOfParticipants: number) {
    return this.gameRepo
      .createQueryBuilder('game')
      .leftJoin('game.participants', 'participant')
      .groupBy('game.id')
      .having('COUNT(participant.id) < :count', { count: amoutnOfParticipants })
      .getMany();
  }

  public async attachUserToGame(gameId: string, userId: string) {
    await this.gameRepo.update(gameId, {
      participants: [],
    });
  }

  public async createGame() {
    return this.gameRepo.create();
  }
}
