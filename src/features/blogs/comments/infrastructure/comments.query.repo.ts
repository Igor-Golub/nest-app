import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostComment } from '../domain/postComment.entity';
import { PaginatedViewDto } from '../../../../common/dto/base.paginated.view-dto';
import { CommentsViewMapperManager } from '../api/mappers/comments';
import { QueryParams } from '../../../../common/decorators/validate';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectRepository(PostComment)
    private readonly postCommentRepository: Repository<PostComment>,
  ) {}

  public async findById(id: string) {
    return this.postCommentRepository.findOne({
      where: { id },
      relations: { author: true, likes: true },
    });
  }

  public async isOwnerComment(id: string, ownerId: string) {
    return this.postCommentRepository.findOne({
      where: { id, authorId: ownerId },
    });
  }

  public async getWithPagination(query: QueryParams, userId?: string, postId?: string) {
    const where: any = {};

    if (postId) {
      where.postId = postId;
    }

    const [comments, totalCount] = await this.postCommentRepository.findAndCount({
      where,
      relations: {
        author: true,
        likes: true,
      },
      order: {
        [query.sortBy]: query.sortDirection.toUpperCase() as 'ASC' | 'DESC',
      },
      take: query.pageSize,
      skip: (query.pageNumber - 1) * query.pageSize,
    });

    const items = comments.map((comment) => CommentsViewMapperManager.commentWithLikeToViewModel(comment, userId));

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      size: query.pageSize,
      page: query.pageNumber,
    });
  }
}
