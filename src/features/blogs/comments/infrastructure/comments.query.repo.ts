import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostComment } from '../domain/postComment.entity';
import { PaginatedViewDto } from '../../../../common/dto/base.paginated.view-dto';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectRepository(PostComment)
    private readonly postCommentRepository: Repository<PostComment>,
  ) {}

  public async findById(id: string) {
    return this.postCommentRepository
      .createQueryBuilder()
      .select()
      .where('id = :id', { id })
      .getOne();
  }

  public async isOwnerComment(id: string, ownerId: string) {
    return this.postCommentRepository.findOne({
      where: { id, authorId: ownerId },
    });
  }

  public async getWithPagination(query) {
    const offset = (query.pageNumber - 1) * query.pageSize;

    const [comments, totalCount] =
      await this.postCommentRepository.findAndCount({
        order: {
          [query.sortBy]: query.sortDirection,
        },
        take: query.pageSize,
        skip: offset,
      });

    return PaginatedViewDto.mapToView({
      totalCount,
      items: comments,
      size: query.pageSize,
      page: query.pageNumber,
    });
  }
}
