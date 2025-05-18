import { Game } from '../domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GameQueryRepo {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
  ) {}

  public async findById(id: string) {
    return this.gameRepository.findOneBy({ id });
  }
}
