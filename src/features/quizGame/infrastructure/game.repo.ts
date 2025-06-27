import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Answer, Game, Participant, Question } from '../domain';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryError } from '../../../core/errors';

@Injectable()
export class GameRepo {
  constructor(
    @InjectRepository(Game) private readonly gameRepo: Repository<Game>,
    @InjectRepository(Participant) private readonly participantRepo: Repository<Participant>,
    @InjectRepository(Question) private readonly questionRepo: Repository<Question>,
    @InjectRepository(Answer) private readonly answerRepo: Repository<Answer>,
  ) {}

  public async checkIsUserAlreadyInGame(userId: string) {
    return this.gameRepo
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.participants', 'participants')
      .leftJoinAndSelect('participants.user', 'user')
      .where('user.id = :userId', { userId })
      .getExists();
  }

  public async findAvailableGames(amountOfParticipants: number) {
    return this.gameRepo
      .createQueryBuilder('game')
      .leftJoin('game.participants', 'participant')
      .groupBy('game.id')
      .having('COUNT(participant.id) < :count', { count: amountOfParticipants })
      .getOne();
  }

  public async findById(id: string) {
    const game = await this.gameRepo.createQueryBuilder('game').where('game.id = :gameId', { gameId: id }).getOne();

    if (!game) throw new RepositoryError(`Game does not exist`);

    return game;
  }

  public async drop() {
    await this.answerRepo.delete({});
    await this.questionRepo.delete({});
    await this.participantRepo.delete({});
    await this.gameRepo.delete({});
  }
}
