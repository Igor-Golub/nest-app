import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Answer, Game, Participant, Question } from '../domain';
import { InjectRepository } from '@nestjs/typeorm';

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

  public async drop() {
    await this.participantRepo.delete({});
    await this.questionRepo.delete({});
    await this.answerRepo.delete({});
    await this.gameRepo.delete({});
  }
}
