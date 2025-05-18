import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
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
    return this.questionRepository.findOneBy({ id });
  }
}
