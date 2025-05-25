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

  public async createQuestion(text: string, answers: string[]) {
    const question = new Question();

    question.text = text;
    question.answers = answers;
    question.published = false;

    const { id } = await this.questionRepository.save(question);

    return id;
  }

  public async updateQuestion(id: string, text: string, answers: string[]) {
    await this.questionRepository.update(id, { text, answers });

    return id;
  }

  public async updatedPublishStatus(id: string, status: boolean) {
    await this.questionRepository.update(id, { published: status });

    return id;
  }

  public async delete(id: string) {
    await this.questionRepository.delete(id);

    return id;
  }
}
