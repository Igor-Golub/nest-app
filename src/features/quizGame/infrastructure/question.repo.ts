import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '../domain';

@Injectable()
export class QuestionRepo {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  public async createQuestion(text: string, answers: JSON) {
    const question = new Question();
    question.text = text;
    question.answers = answers;

    const { id } = await this.questionRepository.save(question);

    return id;
  }
}
