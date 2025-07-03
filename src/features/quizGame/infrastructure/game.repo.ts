import { HttpStatus, Injectable } from '@nestjs/common';
import { QueryRunner, Repository } from 'typeorm';
import { Answer, Game, Participant, Question } from '../domain';
import { InjectRepository } from '@nestjs/typeorm';
import { DomainError, RepositoryError } from '../../../core/errors';
import { GameStatus } from './enums';

@Injectable()
export class GameRepo {
  constructor(
    @InjectRepository(Game) private readonly gameRepo: Repository<Game>,
    @InjectRepository(Participant) private readonly participantRepo: Repository<Participant>,
    @InjectRepository(Question) private readonly questionRepo: Repository<Question>,
    @InjectRepository(Answer) private readonly answerRepo: Repository<Answer>,
  ) {}

  public async checkAmountOfAnswers(gameId: string, userId: string) {
    return this.answerRepo
      .createQueryBuilder('answer')
      .leftJoinAndSelect('answer.participant', 'participant')
      .leftJoinAndSelect('participant.user', 'user')
      .leftJoinAndSelect('participant.game', 'game')
      .where('user.id = :userId', { userId })
      .andWhere('game.id = :gameId', { gameId })
      .getCount();
  }

  public async checkIsGameFinished(gameId: string) {
    const totalAnswers = await this.answerRepo.count({
      where: { participant: { game: { id: gameId } } },
    });

    return totalAnswers === 9;
  }

  public async checkIsUserAlreadyInGame(userId: string) {
    return this.gameRepo
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.participants', 'participants')
      .leftJoinAndSelect('participants.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('game.status IN (:...statuses)', { statuses: [GameStatus.Active, GameStatus.Pending] })
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

  public async findFullGameOrFail(queryRunner: QueryRunner, gameId: string) {
    const game = await queryRunner.manager
      .createQueryBuilder(Game, 'game')
      .leftJoinAndSelect('game.questions', 'questions')
      .leftJoinAndSelect('game.participants', 'participants')
      .leftJoinAndSelect('participants.answers', 'answers')
      .leftJoinAndSelect('participants.user', 'user')
      .leftJoinAndSelect('answers.question', 'question')
      .where('game.id = :gameId', { gameId })
      .orderBy('participants.createdAt', 'ASC')
      .addOrderBy('questions.createdAt', 'ASC')
      .addOrderBy('answers.createdAt', 'ASC')
      .getOne();

    if (!game) throw new DomainError(`Connect failed`, HttpStatus.BAD_REQUEST);
    return game;
  }

  public async drop() {
    await this.answerRepo.delete({});
    await this.questionRepo.delete({});
    await this.participantRepo.delete({});
    await this.gameRepo.delete({});
  }
}
