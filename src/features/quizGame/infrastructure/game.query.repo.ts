import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Game } from '../domain';
import { RepositoryError } from '../../../core/errors/RepositoryError';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GameQueryRepo {
  constructor(
    @InjectRepository(Game)
    private gameRepo: Repository<Game>,
  ) {}

  public async findById(id: string) {
    const game = await this.gameRepo.findOne({
      where: { id },
      relations: {
        questions: true,
        participants: true,
      },
    });

    if (!game) throw new RepositoryError(`Game does not exist`);

    return game;
  }

  public async findByParticipantId(id: string) {
    const game = await this.gameRepo
      .createQueryBuilder('game')
      .innerJoin('game.participants', 'participant', 'participant.id = :participantId', { participantId: id })
      .getOne();

    if (!game) throw new RepositoryError(`Game does not exist`);

    return game;
  }
}
