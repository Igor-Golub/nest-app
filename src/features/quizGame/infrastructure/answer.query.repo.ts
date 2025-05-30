import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Answer } from '../domain';

@Injectable()
export class AnswerQueryRepo {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}

  public async findById(id: string) {
    const answer = await this.answerRepository.findOneBy({ id });

    if (!answer) {
      throw new NotFoundException(`Answer with id ${id} not found`);
    }

    return answer;
  }
}
