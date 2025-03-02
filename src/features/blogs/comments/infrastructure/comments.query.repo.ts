import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostComment } from '../domain/postComment.entity';
import { PaginatedViewDto } from '../../../../common/dto/base.paginated.view-dto';
import { CommentsViewMapperManager } from '../api/mappers/comments';
import { QueryParams } from '../../../../common/decorators/validate';
import { CommentLike } from '../domain/commentLike.entity';
import { getLogger } from 'nodemailer/lib/shared';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectRepository(PostComment)
    private readonly postCommentRepository: Repository<PostComment>,
    @InjectRepository(CommentLike)
    private readonly likeRepository: Repository<CommentLike>,
  ) {}

  public async findById(id: string) {
    return this.postCommentRepository
      .createQueryBuilder('pc')
      .where('pc.id = :id', { id })
      .leftJoinAndSelect('pc.author', 'author')
      .leftJoinAndSelect('pc.likes', 'likes')
      .getOne();
  }

  public async isOwnerComment(id: string, ownerId: string) {
    return this.postCommentRepository.findOne({
      where: { id, authorId: ownerId },
    });
  }

  public async getWithPagination(
    query: QueryParams,
    userId: string | undefined,
    postId: string | undefined = undefined,
  ) {
    console.log({
      order: {
        [query.sortBy]: query.sortDirection,
      },
    });
    const [comments, totalCount] =
      await this.postCommentRepository.findAndCount({
        where: postId ? { postId } : {},
        relations: {
          author: true,
          likes: true,
        },
        order: {
          [query.sortBy]: query.sortDirection,
        },
        take: query.pageSize,
        skip: (query.pageNumber - 1) * query.pageSize,
      });

    return PaginatedViewDto.mapToView({
      totalCount,
      items: comments.map((comment) =>
        CommentsViewMapperManager.commentWithLikeToViewModel(comment, userId),
      ),
      size: query.pageSize,
      page: query.pageNumber,
    });
  }
}
