import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Question } from '../domain';
import { PublishedStatus } from './enums';
import { QuestionsQuery } from '../api/models/input';
import { GameMapManager } from '../api/models/mappers';
import { PaginatedViewDto } from '../../../common/dto/base.paginated.view-dto';

const publishStatusMapper: Omit<Record<PublishedStatus, boolean>, PublishedStatus.All> = {
  [PublishedStatus.NotPublished]: false,
  [PublishedStatus.Published]: true,
};

@Injectable()
export class QuestionQueryRepo {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  public async findWithPagination(params: QuestionsQuery) {
    const where: FindOptionsWhere<Question>[] = [];

    if (publishStatusMapper[params.publishedStatus] !== undefined) {
      where.push({ published: publishStatusMapper[params.publishedStatus] });
    }

    if (params.bodySearchTerm) {
      where.push({ text: ILike(`%${params.bodySearchTerm}%`) });
    }

    const [questions, totalCount] = await this.questionRepository.findAndCount({
      where,
      order: {
        [params.sortBy]: params.sortDirection,
      },
      take: params.pageSize,
      skip: (params.pageNumber - 1) * params.pageSize,
    });

    return PaginatedViewDto.mapToView({
      totalCount,
      size: params.pageSize,
      page: params.pageNumber,
      items: GameMapManager.mapListToView(questions),
    });
  }

  public async findById(id: string) {
    const question = await this.questionRepository.findOneBy({ id });

    if (!question) {
      throw new NotFoundException(`Question with id ${id} not found`);
    }

    return question;
  }
}
