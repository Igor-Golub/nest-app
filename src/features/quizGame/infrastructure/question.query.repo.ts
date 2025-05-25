import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '../domain';
import { QuestionsQuery } from '../api/models/input';

@Injectable()
export class QuestionQueryRepo {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  public async findWithPagination(params: QuestionsQuery) {
    return this.questionRepository.find();
  }

  public async findById(id: string) {
    const question = await this.questionRepository.findOneBy({ id });

    if (!question) {
      throw new NotFoundException(`Question with id ${id} not found`);
    }

    return question;
  }
}
